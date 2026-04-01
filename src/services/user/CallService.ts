import { API_BASE_URL } from '@/config/env'
import { webSocketService, type WebSocketMessage } from '../WebSocketService'

/** Lista en `data` (ResponseDetail del API) o array crudo. */
function unwrapDataArray(body: unknown): unknown[] {
  if (Array.isArray(body)) return body
  if (body !== null && typeof body === "object" && "data" in body) {
    const d = (body as { data: unknown }).data
    if (Array.isArray(d)) return d
  }
  return []
}

function normalizeApiCallToCall(raw: unknown): Call | null {
  if (raw === null || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  const idRaw = o.id
  const id =
    typeof idRaw === "number" && Number.isFinite(idRaw)
      ? idRaw
      : typeof idRaw === "string" && idRaw.trim() !== ""
        ? Number(idRaw)
        : NaN
  if (!Number.isFinite(id)) return null

  const contactRaw = o.contactId ?? o.contact_id
  const contact_id =
    typeof contactRaw === "number" && Number.isFinite(contactRaw)
      ? contactRaw
      : typeof contactRaw === "string" && contactRaw.trim() !== ""
        ? Number(contactRaw)
        : null

  let date: string | null = null
  if (typeof o.date === "string") date = o.date
  else if (o.date != null) date = String(o.date)

  const durRaw = o.duration
  const duration =
    typeof durRaw === "number" && Number.isFinite(durRaw)
      ? durRaw
      : durRaw == null
        ? null
        : Number(durRaw)
  const durationOk =
    duration != null && Number.isFinite(duration) ? duration : null

  return {
    id,
    call_id: typeof o.call_id === "string" ? o.call_id : undefined,
    date,
    duration: durationOk,
    motive: typeof o.motive === "string" ? o.motive : null,
    contactName:
      typeof o.contactName === "string"
        ? o.contactName
        : typeof o["contact_name"] === "string"
          ? o["contact_name"]
          : null,
    contact_id:
      contact_id != null && Number.isFinite(contact_id) ? contact_id : null,
    summary: typeof o.summary === "string" ? o.summary : null,
    intent: typeof o.intent === "string" ? o.intent : null,
    messages: typeof o.messages === "string" ? o.messages : null,
    audioCombined:
      typeof o.audioCombined === "string" ? o.audioCombined : undefined,
    audioAssistant:
      typeof o.audioAssistant === "string" ? o.audioAssistant : undefined,
    audioCustomer:
      typeof o.audioCustomer === "string" ? o.audioCustomer : undefined,
    confidence:
      typeof o.confidence === "number" && Number.isFinite(o.confidence)
        ? o.confidence
        : null,
  }
}

// Llamadas del área usuario (/dashboard/user)
export interface Call {
  id: number
  call_id?: string
  date: string | null
  duration: number | null
  motive: string | null
  contactName: string | null
  contact_id?: number | null
  summary?: string | null
  intent?: string | null
  confidence?: number | null
  messages?: string | null
  audioCombined?: string | null
  audioAssistant?: string | null
  audioCustomer?: string | null
  actions?: CallAction[]
  createdAt?: string
  updatedAt?: string
}

export interface CallAction {
  id: number
  type: string
  details: string
  createdAt: string
}

export type CallsListMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}

export interface CallListResponse {
  success: boolean
  calls?: Call[]
  meta?: CallsListMeta
  error?: string
}

function parseCallsListBody(body: unknown): {
  calls: Call[]
  meta: CallsListMeta
} | null {
  if (body === null || typeof body !== "object") return null
  const root = body as Record<string, unknown>
  const payload = root.data
  if (payload === null || typeof payload !== "object" || Array.isArray(payload))
    return null
  const p = payload as Record<string, unknown>
  const rawList = p.data
  if (!Array.isArray(rawList)) return null
  const metaRaw = p.meta
  if (metaRaw === null || typeof metaRaw !== "object" || Array.isArray(metaRaw))
    return null
  const m = metaRaw as Record<string, unknown>
  const calls = rawList
    .map((item) => normalizeApiCallToCall(item))
    .filter((c): c is Call => c !== null)
  return {
    calls,
    meta: {
      current_page: Number(m.current_page) || 1,
      per_page: Number(m.per_page) || 10,
      total: Number(m.total) || 0,
      last_page: Number(m.last_page) || 1,
    },
  }
}

export interface CallResponse {
  success: boolean
  call?: Call
  error?: string
}

// Función auxiliar para obtener nombres de contactos
async function enrichCallsWithContactNames(calls: Call[]): Promise<Call[]> {
  if (!Array.isArray(calls)) return []

  // Obtener todos los contact_ids únicos que necesitan nombres
  const contactIds: number[] = [
    ...new Set(
      calls.flatMap((call) => {
        const id = call.contact_id
        if (call.contactName || id == null || !Number.isFinite(id)) return []
        return [id]
      }),
    ),
  ]

  const contactsMap = new Map<number, string>()
  if (contactIds.length > 0) {
    try {
      const token = localStorage.getItem('access_token')
      let page = 1
      const perPage = 50
      // Contactos vienen paginados desde el backend
      while (true) {
        const q = new URLSearchParams({
          page: String(page),
          per_page: String(perPage),
        })
        const contactsResponse = await fetch(`${API_BASE_URL}/contacts?${q}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        })

        if (!contactsResponse.ok) break

        const contactsBody: unknown = await contactsResponse.json()
        const payload = (contactsBody as Record<string, unknown>).data
        if (payload === null || typeof payload !== "object" || Array.isArray(payload)) break
        const rawList = (payload as Record<string, unknown>).data
        if (!Array.isArray(rawList)) break
        for (const c of rawList) {
          if (c === null || typeof c !== "object") continue
          const rec = c as Record<string, unknown>
          const cid =
            typeof rec.id === "number"
              ? rec.id
              : typeof rec.id === "string"
                ? Number(rec.id)
                : NaN
          const name = typeof rec.name === "string" ? rec.name : ""
          if (name && typeof cid === "number" && Number.isFinite(cid)) {
            contactsMap.set(cid, name)
          }
        }

        const meta = (payload as Record<string, unknown>).meta as
          | Record<string, unknown>
          | undefined
        const lastPage =
          typeof meta?.last_page === "number" ? meta.last_page : 1
        if (contactIds.every((id) => contactsMap.has(id))) break
        if (page >= lastPage) break
        page += 1
        if (page > 200) break
      }
    } catch (error) {
      console.error('Error obteniendo contactos:', error)
    }
  }

  // Procesar las llamadas para incluir el nombre del contacto
  return calls.map((call) => {
    if (!call.contactName && call.contact_id) {
      const contactName = contactsMap.get(call.contact_id!)
      if (contactName) {
        return {
          ...call,
          contactName: contactName
        }
      }
    }
    return call
  })
}

/** Listado paginado; `from` / `to` en yyyy-MM-dd acotan por fecha de llamada (inclusive). */
export async function getCalls(params?: {
  page?: number
  per_page?: number
  from?: string
  to?: string
}): Promise<CallListResponse> {
  try {
    const token = localStorage.getItem('access_token')

    const q = new URLSearchParams({
      page: String(Math.max(1, params?.page ?? 1)),
      per_page: String(Math.max(1, params?.per_page ?? 10)),
    })
    if (params?.from) q.set('from', params.from)
    if (params?.to) q.set('to', params.to)

    const response = await fetch(`${API_BASE_URL}/calls?${q}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      }
    }

    const body: unknown = await response.json()
    const parsed = parseCallsListBody(body)
    if (!parsed) {
      return {
        success: false,
        error: 'Respuesta inválida del servidor (llamadas)'
      }
    }

    const processedCalls = await enrichCallsWithContactNames(parsed.calls)

    return {
      success: true,
      calls: processedCalls,
      meta: parsed.meta
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión'
    }
  }
}

// Obtener detalles de una llamada por ID
export async function getCallDetails(id: string): Promise<CallResponse> {
  try {
    const token = localStorage.getItem('access_token')

    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`
      }
    }

    const body: unknown = await response.json()
    let callRaw: unknown = body
    if (
      body !== null &&
      typeof body === "object" &&
      "data" in body &&
      (body as { data: unknown }).data !== null &&
      typeof (body as { data: unknown }).data === "object"
    ) {
      callRaw = (body as { data: unknown }).data
    }
    const call =
      callRaw !== null && typeof callRaw === "object"
        ? normalizeApiCallToCall(callRaw)
        : null

    return {
      success: true,
      call: call ?? undefined,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión'
    }
  }
}

export async function deleteCall(
  id: string | number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = localStorage.getItem('access_token')
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`,
      }
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error de conexión',
    }
  }
}

// Función para suscribirse a eventos de WebSocket
export function subscribeToCallEvents(
  eventType: 'callCreated' | 'callUpdated' | 'callDeleted' | 'callsUpdated',
  callback: (data: Call) => void
): () => void {
  try {
    // Conectar WebSocket si no está conectado
    webSocketService.connect()

    // Mapear tipos de eventos a topics
    const topicMap = {
      callCreated: '/topic/calls/new',
      callUpdated: '/topic/calls/updated',
      callDeleted: '/topic/calls/deleted',
      callsUpdated: '/topic/calls'
    }

    const topic = topicMap[eventType]

    // Suscribirse al topic
    webSocketService.subscribe(topic, (message: WebSocketMessage) => {
      if (message.data) {
        callback(message.data as Call)
      }
    })

    // Retornar función para desuscribirse
    return () => {
      webSocketService.unsubscribe(topic)
    }
  } catch (error) {
    console.warn('Failed to subscribe to WebSocket events:', error)
    // Retornar función vacía si falla la suscripción
    return () => {}
  }
}

// Función para desconectar WebSocket
export function disconnectWebSocket(): void {
  webSocketService.disconnect()
}
