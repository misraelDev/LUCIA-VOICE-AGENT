import { webSocketService, type WebSocketMessage } from "./WebSocketService";
import { API_BASE_URL } from "@/config/env";

/** Lista en `data` (ResponseDetail del API) o array crudo. */
function unwrapDataArray(body: unknown): unknown[] {
  if (Array.isArray(body)) return body;
  if (body !== null && typeof body === "object" && "data" in body) {
    const d = (body as { data: unknown }).data;
    if (Array.isArray(d)) return d;
  }
  return [];
}

function unwrapDataValue(body: unknown): unknown {
  if (body !== null && typeof body === "object" && "data" in body) {
    return (body as { data: unknown }).data;
  }
  return body;
}

function parsePhoneToNumber(
  phoneNumber: string | number | null | undefined,
): number | null {
  if (phoneNumber == null) return null;
  if (typeof phoneNumber === "number" && Number.isFinite(phoneNumber)) {
    return phoneNumber;
  }
  const s = String(phoneNumber).replace(/\D/g, "");
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function isoDateTime(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "string") return v;
  return String(v);
}

function normalizeContact(raw: unknown): Contact | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const idRaw = o.id ?? o.contact_id;
  const id =
    typeof idRaw === "number" && Number.isFinite(idRaw)
      ? idRaw
      : typeof idRaw === "string" && idRaw.trim() !== ""
        ? Number(idRaw)
        : NaN;
  if (!Number.isFinite(id)) return null;

  const phoneRaw: unknown = o.phoneNumber ?? o.phone_number;
  const phone = parsePhoneToNumber(
    phoneRaw === null || phoneRaw === undefined
      ? phoneRaw
      : typeof phoneRaw === "string" || typeof phoneRaw === "number"
        ? phoneRaw
        : undefined,
  );

  return {
    id,
    contact_id: id,
    name: typeof o.name === "string" ? o.name : null,
    email: typeof o.email === "string" ? o.email : null,
    phone_number: phone,
    creation_date: isoDateTime(o.createdAt ?? o.creation_date),
  };
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface Contact {
  id: number;
  contact_id: number;
  name: string | null;
  email: string | null;
  phone_number: number | null;
  creation_date: string | null;
}

export interface CreateContactData {
  name: string | null;
  email: string | null;
  phone_number: number | null;
}

export interface UpdateContactData {
  name?: string | null;
  email?: string | null;
  phone_number?: number | null;
}

export interface ContactServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ContactListMeta = {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
};

export interface ContactListResponse {
  success: boolean;
  contacts?: Contact[];
  meta?: ContactListMeta;
  error?: string;
}

/** Respuesta paginada del API bajo `data`: `{ data: Contact[], meta }`. */
function parseContactsListBody(body: unknown): {
  contacts: Contact[];
  meta: ContactListMeta;
} | null {
  if (body === null || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  const payload = root.data;
  if (payload === null || typeof payload !== "object" || Array.isArray(payload))
    return null;
  const p = payload as Record<string, unknown>;
  const rawList = p.data;
  if (!Array.isArray(rawList)) return null;
  const metaRaw = p.meta;
  if (metaRaw === null || typeof metaRaw !== "object" || Array.isArray(metaRaw))
    return null;
  const m = metaRaw as Record<string, unknown>;
  const contacts = rawList
    .map((item) => normalizeContact(item))
    .filter((c): c is Contact => c !== null);
  return {
    contacts,
    meta: {
      current_page: Number(m.current_page) || 1,
      per_page: Number(m.per_page) || 10,
      total: Number(m.total) || 0,
      last_page: Number(m.last_page) || 1,
    },
  };
}

export interface ContactResponse {
  success: boolean;
  contact?: Contact;
  error?: string;
}

// Función auxiliar para manejar respuestas HTTP
async function handleResponse<T>(
  response: Response,
): Promise<ContactServiceResponse<T>> {
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

// Crear un nuevo contacto
export async function createContact(
  contactData: CreateContactData,
): Promise<ContactServiceResponse<Contact>> {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        name: contactData.name,
        email: contactData.email,
        phoneNumber:
          contactData.phone_number != null
            ? String(contactData.phone_number)
            : null,
      }),
    });

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data != null) {
      const c = normalizeContact(unwrapDataValue(result.data));
      if (c) return { success: true, data: c };
    }
    return {
      success: false,
      error: result.error || "Error al crear el contacto",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

/** Listado paginado (backend `page`, `per_page`). */
export async function listContacts(params: {
  page: number;
  per_page: number;
}): Promise<ContactListResponse> {
  try {
    const q = new URLSearchParams({
      page: String(Math.max(1, params.page)),
      per_page: String(Math.max(1, params.per_page)),
    });
    const response = await fetch(`${API_BASE_URL}/contacts?${q}`, {
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
    const parsed = parseContactsListBody(body);
    if (!parsed) {
      return {
        success: false,
        error: "Respuesta inválida del servidor (contactos)",
      };
    }
    return {
      success: true,
      contacts: parsed.contacts,
      meta: parsed.meta,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

/** Primera página amplia; preferir {@link listContacts} con paginación en UI. */
export async function getAllContacts(): Promise<ContactListResponse> {
  return listContacts({ page: 1, per_page: 100 });
}

// Obtener un contacto por ID
export async function getContactById(id: number): Promise<ContactResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data != null) {
      const contact = normalizeContact(unwrapDataValue(result.data));
      if (contact) {
        return {
          success: true,
          contact,
        };
      }
    }
    return {
      success: false,
      error: result.error || "Error al obtener el contacto",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Actualizar un contacto
export async function updateContact(
  id: number,
  contactData: UpdateContactData,
): Promise<ContactServiceResponse<Contact>> {
  try {
    const payload: Record<string, unknown> = {};
    if (contactData.name !== undefined) payload.name = contactData.name;
    if (contactData.email !== undefined) payload.email = contactData.email;
    if (contactData.phone_number !== undefined) {
      payload.phoneNumber =
        contactData.phone_number == null
          ? null
          : String(contactData.phone_number);
    }

    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data != null) {
      const c = normalizeContact(unwrapDataValue(result.data));
      if (c) return { success: true, data: c };
    }
    return {
      success: false,
      error: result.error || "Error al actualizar el contacto",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Eliminar un contacto
export async function deleteContact(
  id: number,
): Promise<ContactServiceResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
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

// Buscar contactos por nombre
export async function getContactsByName(
  name: string,
): Promise<ContactListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/search/name/${encodeURIComponent(name)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data !== undefined) {
      const contacts = unwrapDataArray(result.data)
        .map(normalizeContact)
        .filter((c): c is Contact => c !== null);
      return {
        success: true,
        contacts,
      };
    }
    return {
      success: false,
      error: result.error || "Error al buscar contactos por nombre",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar contacto por email
export async function getContactByEmail(
  email: string,
): Promise<ContactResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/search/email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data != null) {
      const contact = normalizeContact(unwrapDataValue(result.data));
      if (contact) {
        return {
          success: true,
          contact,
        };
      }
    }
    return {
      success: false,
      error: result.error || "Error al buscar contacto por email",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar contacto por número de teléfono
export async function getContactByPhoneNumber(
  phoneNumber: string,
): Promise<ContactResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/search/phone/${encodeURIComponent(phoneNumber)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data != null) {
      const contact = normalizeContact(unwrapDataValue(result.data));
      if (contact) {
        return {
          success: true,
          contact,
        };
      }
    }
    return {
      success: false,
      error: result.error || "Error al buscar contacto por teléfono",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Buscar contactos por texto en nombre o email
export async function searchContacts(
  query: string,
): Promise<ContactListResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data !== undefined) {
      const contacts = unwrapDataArray(result.data)
        .map(normalizeContact)
        .filter((c): c is Contact => c !== null);
      return {
        success: true,
        contacts,
      };
    }
    return {
      success: false,
      error: result.error || "Error al buscar contactos",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Verificar si existe un email
export async function checkEmailExists(
  email: string,
): Promise<ContactServiceResponse<boolean>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/exists/email/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data !== undefined) {
      const v = unwrapDataValue(result.data);
      const data = typeof v === "boolean" ? v : false;
      return { success: true, data };
    }
    return {
      success: false,
      error: result.error || "Error al verificar el email",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// Verificar si existe un número de teléfono
export async function checkPhoneNumberExists(
  phoneNumber: string,
): Promise<ContactServiceResponse<boolean>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/contacts/exists/phone/${encodeURIComponent(phoneNumber)}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    const result = await handleResponse<unknown>(response);
    if (result.success && result.data !== undefined) {
      const v = unwrapDataValue(result.data);
      const data = typeof v === "boolean" ? v : false;
      return { success: true, data };
    }
    return {
      success: false,
      error: result.error || "Error al verificar el teléfono",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error de conexión",
    };
  }
}

// WebSocket functions using the existing WebSocketService

// Función para suscribirse a eventos de WebSocket
export function subscribeToContactEvents(
  eventType:
    | "contactCreated"
    | "contactUpdated"
    | "contactDeleted"
    | "contactsUpdated",
  callback: (data: Contact) => void,
): () => void {
  // Conectar WebSocket si no está conectado
  webSocketService.connect();

  // Mapear tipos de eventos a topics
  const topicMap = {
    contactCreated: "/topic/contacts/new",
    contactUpdated: "/topic/contacts/updated",
    contactDeleted: "/topic/contacts/deleted",
    contactsUpdated: "/topic/contacts",
  };

  const topic = topicMap[eventType];

  // Suscribirse al topic
  webSocketService.subscribe(topic, (message: WebSocketMessage) => {
    if (message.data) {
      callback(message.data as Contact);
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
