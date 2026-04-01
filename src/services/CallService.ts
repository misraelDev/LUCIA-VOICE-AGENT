import { API_BASE_URL } from "@/config/env";
import { listContacts } from "./ContactService";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface Call {
  id: number;
  call_id?: string;
  date: string | null;
  duration: number | null;
  motive: string | null;
  contactName: string | null;
  contact_id?: number | null;
  summary?: string | null;
  intent?: string | null;
  confidence?: number | null;
  messages?: string | null;
  audioCombined?: string | null;
  audioAssistant?: string | null;
  audioCustomer?: string | null;
  actions?: CallAction[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CallAction {
  id: number;
  type: string;
  details: string;
  createdAt: string;
}

export interface CreateCallData {
  call_id: string;
  date?: string;
  duration?: number;
  motive?: string;
  contactName?: string;
  contact_id?: number;
  summary?: string;
  intent?: string;
  confidence?: number;
  messages?: string;
  audioCombined?: string;
  audioAssistant?: string;
  audioCustomer?: string;
}

export interface UpdateCallData {
  date?: string;
  duration?: number;
  motive?: string;
  contactName?: string;
  contact_id?: number;
  summary?: string;
  intent?: string;
  confidence?: number;
  messages?: string;
  audioCombined?: string;
  audioAssistant?: string;
  audioCustomer?: string;
}

export interface CallServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CallListResponse {
  success: boolean;
  calls?: Call[];
  error?: string;
}

export interface CallResponse {
  success: boolean;
  call?: Call;
  error?: string;
}

// Función auxiliar para manejar respuestas HTTP
async function handleResponse<T>(
  response: Response,
): Promise<CallServiceResponse<T>> {
  if (!response.ok) {
    const errorText = await response.text();
    return {
      success: false,
      error: `Error ${response.status}: ${errorText}`,
    };
  }

  try {
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      error: "Error al procesar la respuesta del servidor",
    };
  }
}

// Función auxiliar para obtener nombres de contactos
async function enrichCallsWithContactNames(calls: Call[]): Promise<Call[]> {
  // Obtener todos los contact_ids únicos que necesitan nombres
  const contactIds: number[] = [
    ...new Set(
      calls.flatMap((call) => {
        const id = call.contact_id;
        if (call.contactName || id == null || !Number.isFinite(id)) return [];
        return [id];
      }),
    ),
  ];

  const contactsMap = new Map<number, string>();
  if (contactIds.length > 0) {
    try {
      let page = 1;
      const perPage = 50;
      while (true) {
        const r = await listContacts({ page, per_page: perPage });
        if (!r.success || !r.contacts) break;
        for (const c of r.contacts) {
          if (
            c.name &&
            c.contact_id != null &&
            Number.isFinite(c.contact_id)
          ) {
            contactsMap.set(c.contact_id, c.name);
          }
        }
        if (contactIds.every((id) => contactsMap.has(id))) break;
        const last = r.meta?.last_page ?? 1;
        if (page >= last) break;
        page += 1;
        if (page > 200) break;
      }
    } catch (error) {
      console.error("Error obteniendo contactos:", error);
    }
  }

  // Procesar las llamadas para incluir el nombre del contacto
  return calls.map((call) => {
    if (!call.contactName && call.contact_id) {
      const contactName = contactsMap.get(call.contact_id!);
      if (contactName) {
        return {
          ...call,
          contactName: contactName,
        };
      }
    }
    return call;
  });
}

/** Primera(s) páginas grandes (legacy); el dashboard usa `user/CallService.getCalls` paginado. */
export async function getCalls(): Promise<CallListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls?page=1&per_page=500`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`,
      };
    }

    const body: unknown = await response.json();
    const root = body as Record<string, unknown>;
    const payload = root.data;
    if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
      return { success: false, error: "Respuesta inválida del servidor" };
    }
    const p = payload as Record<string, unknown>;
    const rawList = p.data;
    if (!Array.isArray(rawList)) {
      return { success: false, error: "Respuesta inválida del servidor" };
    }

    const calls = rawList as Call[];
    const processedCalls = await enrichCallsWithContactNames(calls);

    return {
      success: true,
      calls: processedCalls,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Obtener detalles de una llamada por ID
export async function getCallDetails(id: string): Promise<CallResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Error ${response.status}: ${errorText}`,
      };
    }

    const call = await response.json();

    return {
      success: true,
      call: call,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Crear una nueva llamada
export async function createCall(
  callData: CreateCallData,
): Promise<CallServiceResponse<Call>> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(callData),
    });

    return await handleResponse<Call>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Actualizar una llamada
export async function updateCall(
  id: number | string,
  callData: UpdateCallData,
): Promise<CallServiceResponse<Call>> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(callData),
    });

    return await handleResponse<Call>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Eliminar una llamada
export async function deleteCall(
  id: number | string,
): Promise<CallServiceResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return await handleResponse<void>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar llamadas por rango de fechas
export async function getCallsByDateRange(
  startDate: string,
  endDate: string,
): Promise<CallListResponse> {
  try {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });

    const response = await fetch(`${API_BASE_URL}/calls/date-range?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<Call[]>(response);
    if (result.success && result.data) {
      const processedCalls = await enrichCallsWithContactNames(result.data);

      return {
        success: true,
        calls: processedCalls,
      };
    }
    return {
      success: false,
      error:
        result.error || "Error al obtener las llamadas por rango de fechas",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar llamadas por contacto
export async function getCallsByContactId(
  contactId: number,
): Promise<CallListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/contact/${contactId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<Call[]>(response);
    if (result.success && result.data) {
      return {
        success: true,
        calls: result.data,
      };
    }
    return {
      success: false,
      error: result.error || "Error al obtener las llamadas del contacto",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar llamadas por texto
export async function searchCalls(query: string): Promise<CallListResponse> {
  try {
    const params = new URLSearchParams({ q: query });

    const response = await fetch(`${API_BASE_URL}/calls/search?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<Call[]>(response);
    if (result.success && result.data) {
      return {
        success: true,
        calls: result.data,
      };
    }
    return {
      success: false,
      error: result.error || "Error al buscar las llamadas",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Obtener llamadas del día actual
export async function getTodayCalls(): Promise<CallListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/today`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<Call[]>(response);
    if (result.success && result.data) {
      return {
        success: true,
        calls: result.data,
      };
    }
    return {
      success: false,
      error: result.error || "Error al obtener las llamadas del día",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Obtener estadísticas de llamadas
export async function getCallStatistics(): Promise<
  CallServiceResponse<Record<string, unknown>>
> {
  try {
    const response = await fetch(`${API_BASE_URL}/calls/statistics`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return await handleResponse<Record<string, unknown>>(response);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// WebSocket functions using the existing WebSocketService
import { webSocketService, type WebSocketMessage } from "./WebSocketService";

// Función para suscribirse a eventos de WebSocket
export function subscribeToCallEvents(
  eventType: "callCreated" | "callUpdated" | "callDeleted" | "callsUpdated",
  callback: (data: Call) => void,
): () => void {
  // Conectar WebSocket si no está conectado
  webSocketService.connect();

  // Mapear tipos de eventos a topics
  const topicMap = {
    callCreated: "/topic/calls/new",
    callUpdated: "/topic/calls/updated",
    callDeleted: "/topic/calls/deleted",
    callsUpdated: "/topic/calls",
  };

  const topic = topicMap[eventType];

  // Suscribirse al topic
  webSocketService.subscribe(topic, (message: WebSocketMessage) => {
    if (message.data) {
      callback(message.data as Call);
    }
  });

  // Retornar función para desuscribirse
  return () => {
    webSocketService.unsubscribe(topic);
  };
}

// Función para desconectar WebSocket
export function disconnectWebSocket(): void {
  webSocketService.disconnect();
}
