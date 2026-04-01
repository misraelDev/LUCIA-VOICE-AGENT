import { API_BASE_URL } from "@/config/env";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

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

function normalizeTimePart(v: unknown): string {
  if (typeof v === "string") {
    const t = v.trim();
    if (/^\d{1,2}:\d{2}$/.test(t)) return `${t}:00`;
    return t;
  }
  if (Array.isArray(v) && v.length >= 2) {
    const h = Number(v[0]);
    const m = Number(v[1]);
    const s = v.length > 2 ? Number(v[2]) : 0;
    const ss = Number.isFinite(s) ? s : 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
  return "00:00:00";
}

function normalizeDatePart(d: unknown): string {
  if (typeof d === "string") {
    if (d.length >= 10 && d[4] === "-") return d.slice(0, 10);
    return d;
  }
  if (Array.isArray(d) && d.length >= 3) {
    const y = d[0];
    const m = d[1];
    const day = d[2];
    return `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  return "";
}

function normalizeAppointment(raw: unknown): Appointment | null {
  if (raw === null || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const idRaw = o.id;
  const id =
    typeof idRaw === "number" && Number.isFinite(idRaw)
      ? idRaw
      : typeof idRaw === "string" && idRaw.trim() !== ""
        ? Number(idRaw)
        : NaN;
  if (!Number.isFinite(id)) return null;

  const statusRaw = o.status;
  let status =
    typeof statusRaw === "string"
      ? statusRaw.toLowerCase()
      : statusRaw != null
        ? String(statusRaw).toLowerCase()
        : "unassigned";
  if (status === "scheduled") status = "reserved";

  const createdAt = o.createdAt != null ? String(o.createdAt) : "";
  const updatedAt = o.updatedAt != null ? String(o.updatedAt) : "";

  return {
    id,
    summary: typeof o.summary === "string" ? o.summary : "",
    description:
      typeof o.description === "string" ? o.description : undefined,
    location: typeof o.location === "string" ? o.location : undefined,
    colorId: typeof o.colorId === "string" ? o.colorId : undefined,
    startTime: normalizeTimePart(o.startTime),
    endTime: normalizeTimePart(o.endTime),
    date: normalizeDatePart(o.date),
    status,
    contactPhone:
      typeof o.contactPhone === "string" ? o.contactPhone : undefined,
    createdAt,
    updatedAt,
  };
}

function parseAppointmentFromBody(json: unknown): Appointment | null {
  return normalizeAppointment(unwrapDataValue(json));
}

function parseAppointmentsFromBody(json: unknown): Appointment[] {
  return unwrapDataArray(json)
    .map(normalizeAppointment)
    .filter((a): a is Appointment => a !== null);
}

function errorDetailFromBody(body: unknown): string | undefined {
  if (body !== null && typeof body === "object" && "detail" in body) {
    const d = (body as { detail?: unknown }).detail;
    if (typeof d === "string") return d;
  }
  if (body !== null && typeof body === "object" && "message" in body) {
    const m = (body as { message?: unknown }).message;
    if (typeof m === "string") return m;
  }
  return undefined;
}

export interface Appointment {
  id: number;
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  startTime: string;
  endTime: string;
  date: string;
  status: string;
  contactPhone?: string;
}

export interface UpdateAppointmentData {
  summary?: string;
  description?: string;
  location?: string;
  colorId?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  status?: string;
  contactPhone?: string;
}

export interface AppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  message?: string;
  error?: string;
}

export interface GetAllAppointmentsResponse {
  success: boolean;
  appointments?: Appointment[];
  error?: string;
}

export interface GetAppointmentByIdResponse {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}

export interface DeleteAppointmentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface AvailabilityResponse {
  success: boolean;
  isAvailable?: boolean;
  error?: string;
}

export interface AppointmentStats {
  total: number;
  byStatus: {
    confirmada: number;
    reservada: number;
    cancelada: number;
    sinAsignar: number;
  };
  byDate: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface GetAppointmentStatsResponse {
  success: boolean;
  stats?: AppointmentStats;
  error?: string;
}

class AppointmentService {
  async createAppointment(
    data: CreateAppointmentData,
  ): Promise<AppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            (typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: string }).message === "string"
              ? (json as { message: string }).message
              : null) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const appointment = parseAppointmentFromBody(json);

      return {
        success: true,
        appointment: appointment ?? undefined,
        message: "Cita creada exitosamente",
      };
    } catch (error) {
      console.error("Error creando cita:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al crear la cita",
      };
    }
  }

  async getAllAppointments(): Promise<GetAllAppointmentsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas",
      };
    }
  }

  async getAppointmentById(
    id: number | string,
  ): Promise<GetAppointmentByIdResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await response.json();
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Cita no encontrada",
          };
        }
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const appointment = parseAppointmentFromBody(json);

      return {
        success: true,
        appointment: appointment ?? undefined,
      };
    } catch (error) {
      console.error("Error obteniendo cita por ID:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener la cita",
      };
    }
  }

  async updateAppointment(
    id: number | string,
    data: UpdateAppointmentData,
  ): Promise<AppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Cita no encontrada",
          };
        }
        throw new Error(
          errorDetailFromBody(json) ||
            (typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: string }).message === "string"
              ? (json as { message: string }).message
              : null) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const appointment = parseAppointmentFromBody(json);

      return {
        success: true,
        appointment: appointment ?? undefined,
        message: "Cita actualizada exitosamente",
      };
    } catch (error) {
      console.error("Error actualizando cita:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al actualizar la cita",
      };
    }
  }

  async deleteAppointment(
    id: number | string,
  ): Promise<DeleteAppointmentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Cita no encontrada",
          };
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        message: "Cita eliminada exitosamente",
      };
    } catch (error) {
      console.error("Error eliminando cita:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al eliminar la cita",
      };
    }
  }

  async getAppointmentsByDate(
    date: string,
  ): Promise<GetAllAppointmentsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/date/${date}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas por fecha:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas por fecha",
      };
    }
  }

  async getAppointmentsByStatus(
    status: string,
  ): Promise<GetAllAppointmentsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/status/${status}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            (typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: string }).message === "string"
              ? (json as { message: string }).message
              : null) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas por estado:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas por estado",
      };
    }
  }

  async getAppointmentsByDateAndStatus(
    date: string,
    status: string,
  ): Promise<GetAllAppointmentsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/date/${date}/status/${status}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            (typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: string }).message === "string"
              ? (json as { message: string }).message
              : null) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas por fecha y estado:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas por fecha y estado",
      };
    }
  }

  async getAppointmentsByDateRange(
    startDate: string,
    endDate: string,
  ): Promise<GetAllAppointmentsResponse> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
      });

      const response = await fetch(
        `${API_BASE_URL}/appointments/date-range?${params}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas por rango de fechas:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas por rango de fechas",
      };
    }
  }

  async getAppointmentsByContactPhone(
    contactPhone: string,
  ): Promise<GetAllAppointmentsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/phone/${encodeURIComponent(contactPhone)}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error obteniendo citas por teléfono:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las citas por teléfono",
      };
    }
  }

  async searchAppointments(query: string): Promise<GetAllAppointmentsResponse> {
    try {
      const params = new URLSearchParams({ q: query });

      const response = await fetch(
        `${API_BASE_URL}/appointments/search?${params}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      return {
        success: true,
        appointments: parseAppointmentsFromBody(json),
      };
    } catch (error) {
      console.error("Error buscando citas:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al buscar las citas",
      };
    }
  }

  async changeAppointmentStatus(
    id: number | string,
    newStatus: string,
  ): Promise<AppointmentResponse> {
    try {
      const params = new URLSearchParams({ newStatus });

      const response = await fetch(
        `${API_BASE_URL}/appointments/${id}/status?${params}`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Cita no encontrada",
          };
        }
        throw new Error(
          errorDetailFromBody(json) ||
            (typeof json === "object" &&
            json !== null &&
            "message" in json &&
            typeof (json as { message?: string }).message === "string"
              ? (json as { message: string }).message
              : null) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const appointment = parseAppointmentFromBody(json);

      return {
        success: true,
        appointment: appointment ?? undefined,
        message: "Estado de la cita actualizado exitosamente",
      };
    } catch (error) {
      console.error("Error cambiando estado de la cita:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al cambiar el estado de la cita",
      };
    }
  }

  async checkAvailability(
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: number,
  ): Promise<AvailabilityResponse> {
    try {
      const params = new URLSearchParams({
        date,
        startTime,
        endTime,
      });

      if (excludeAppointmentId) {
        params.append("excludeAppointmentId", excludeAppointmentId.toString());
      }

      const response = await fetch(
        `${API_BASE_URL}/appointments/availability?${params}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        },
      );

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const v = unwrapDataValue(json);
      const isAvailable = v === true;

      return {
        success: true,
        isAvailable,
      };
    } catch (error) {
      console.error("Error verificando disponibilidad:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al verificar la disponibilidad",
      };
    }
  }

  // Método para obtener estadísticas de citas (si el backend lo implementa)
  async getAppointmentStats(): Promise<GetAppointmentStatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/stats`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(
          errorDetailFromBody(json) ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }

      const inner = unwrapDataValue(json);
      const stats =
        inner !== null && typeof inner === "object"
          ? (inner as AppointmentStats)
          : (json as AppointmentStats);

      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas de citas:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las estadísticas",
      };
    }
  }
}

export const appointmentService = new AppointmentService();

// Exportar métodos individuales para uso directo
export const createAppointment =
  appointmentService.createAppointment.bind(appointmentService);
export const getAllAppointments =
  appointmentService.getAllAppointments.bind(appointmentService);
export const getAppointmentById =
  appointmentService.getAppointmentById.bind(appointmentService);
export const updateAppointment =
  appointmentService.updateAppointment.bind(appointmentService);
export const deleteAppointment =
  appointmentService.deleteAppointment.bind(appointmentService);
export const getAppointmentsByDate =
  appointmentService.getAppointmentsByDate.bind(appointmentService);
export const getAppointmentsByStatus =
  appointmentService.getAppointmentsByStatus.bind(appointmentService);
export const getAppointmentsByDateAndStatus =
  appointmentService.getAppointmentsByDateAndStatus.bind(appointmentService);
export const getAppointmentsByDateRange =
  appointmentService.getAppointmentsByDateRange.bind(appointmentService);
export const getAppointmentsByContactPhone =
  appointmentService.getAppointmentsByContactPhone.bind(appointmentService);
export const searchAppointments =
  appointmentService.searchAppointments.bind(appointmentService);
export const changeAppointmentStatus =
  appointmentService.changeAppointmentStatus.bind(appointmentService);
export const checkAvailability =
  appointmentService.checkAvailability.bind(appointmentService);
export const getAppointmentStats =
  appointmentService.getAppointmentStats.bind(appointmentService);

// WebSocket functions using the existing WebSocketService
import { webSocketService, type WebSocketMessage } from "./WebSocketService";

// Función para suscribirse a eventos de WebSocket
export function subscribeToAppointmentEvents(
  eventType:
    | "appointmentCreated"
    | "appointmentUpdated"
    | "appointmentCancelled"
    | "appointmentStatusChanged"
    | "appointmentsByDateConsulted",
  callback: (data: Appointment) => void,
): () => void {
  // Conectar WebSocket si no está conectado
  webSocketService.connect();

  // Mapear tipos de eventos a topics
  const topicMap = {
    appointmentCreated: "/topic/appointments/new",
    appointmentUpdated: "/topic/appointments/updated",
    appointmentCancelled: "/topic/appointments/cancelled",
    appointmentStatusChanged: "/topic/appointments/status-changed",
    appointmentsByDateConsulted: "/topic/appointments/by-date-consulted",
  };

  const topic = topicMap[eventType];

  // Suscribirse al topic
  webSocketService.subscribe(topic, (message: WebSocketMessage) => {
    if (message.data) {
      callback(message.data as Appointment);
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

export default AppointmentService;
