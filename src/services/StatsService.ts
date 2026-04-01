import { webSocketService, type WebSocketMessage } from "./WebSocketService";
import { userService } from "./UserService";
import { API_BASE_URL } from "@/config/env";

// Interfaces para las estadísticas del dashboard
export interface DashboardStats {
  totalCalls: number;
  totalContacts: number;
  totalAppointments: number;
  averageCallDuration: number;
  historicalData: HistoricalData[];
  topConversations: TopConversation[];
  frequentMotives: FrequentMotive[];
  recentContacts: RecentContact[];
  summary: Summary;
}

// Interfaz para el mensaje WebSocket del backend
export interface WebSocketStatsMessage {
  dashboardStats: DashboardStats;
  timestamp: number;
}

export interface HistoricalData {
  llamadas: number;
  month: string;
  citas: number;
}

export interface TopConversation {
  duration: number;
  date: string;
  contact_name: string;
  motive: string;
}

export interface FrequentMotive {
  total_calls: number;
  motive: string;
}

export interface RecentContact {
  name: string;
  phone_number: string | null;
  creation_date: string;
  email: string | null;
}

export interface Summary {
  llamadas_ultimo_anio: number;
  citas_ultimo_anio: number;
}

// Nuevos tipos para /api/stats/all
export interface AllStatsAppointment {
  id: number;
  createdAt: string;
  updatedAt: string;
  summary: string;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  date: string; // YYYY-MM-DD
  status: string;
  description: string;
  location: string;
  contactPhone: string;
}

export interface AllStatsCall {
  id: number;
  date: string; // ISO date
  duration: number; // seconds
  motive: string;
  contactName: string;
  summary: string;
  intent: string;
  messages: string;
  audioCombined: string;
  audioAssistant: string;
  audioCustomer: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllStatsResponse {
  appointments: AllStatsAppointment[];
  calls: AllStatsCall[];
}

/** Cuerpo JSON del backend (`ResponseDetail<T>`). */
interface ApiResponseEnvelope<T> {
  data?: T | null;
  title?: string;
  status?: number;
  detail?: string;
}

function normalizeAllStatsPayload(raw: unknown): AllStatsResponse {
  const payload =
    raw && typeof raw === "object" && "data" in raw
      ? (raw as ApiResponseEnvelope<AllStatsResponse>).data
      : (raw as AllStatsResponse | null | undefined);

  if (!payload || typeof payload !== "object") {
    return { calls: [], appointments: [] };
  }

  return {
    calls: Array.isArray(payload.calls) ? payload.calls : [],
    appointments: Array.isArray(payload.appointments)
      ? payload.appointments
      : [],
  };
}

function normalizeDashboardStatsPayload(raw: unknown): DashboardStats {
  const payload =
    raw && typeof raw === "object" && "data" in raw
      ? (raw as ApiResponseEnvelope<DashboardStats>).data
      : (raw as DashboardStats | null | undefined);

  if (!payload || typeof payload !== "object") {
    throw new Error("Respuesta de estadísticas sin datos");
  }

  return {
    ...payload,
    historicalData: Array.isArray(payload.historicalData)
      ? payload.historicalData
      : [],
    topConversations: Array.isArray(payload.topConversations)
      ? payload.topConversations
      : [],
    frequentMotives: Array.isArray(payload.frequentMotives)
      ? payload.frequentMotives
      : [],
    recentContacts: Array.isArray(payload.recentContacts)
      ? payload.recentContacts
      : [],
  };
}

/**
 * Obtiene todas las estadísticas del dashboard desde el backend
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const token = userService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener estadísticas: ${response.status}`);
    }

    const json: unknown = await response.json();
    return normalizeDashboardStatsPayload(json);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
}

/**
 * Obtiene solo el total de llamadas
 */
export async function getTotalCalls(): Promise<number> {
  try {
    const stats = await getDashboardStats();
    return stats.totalCalls;
  } catch (error) {
    console.error("Error fetching total calls:", error);
    return 0;
  }
}

/**
 * Obtiene solo el total de contactos
 */
export async function getTotalContacts(): Promise<number> {
  try {
    const stats = await getDashboardStats();
    return stats.totalContacts;
  } catch (error) {
    console.error("Error fetching total contacts:", error);
    return 0;
  }
}

/**
 * Obtiene solo el total de citas
 */
export async function getTotalAppointments(): Promise<number> {
  try {
    const stats = await getDashboardStats();
    return stats.totalAppointments;
  } catch (error) {
    console.error("Error fetching total appointments:", error);
    return 0;
  }
}

/**
 * Obtiene solo la duración promedio de llamadas
 */
export async function getAverageCallDuration(): Promise<string> {
  try {
    const stats = await getDashboardStats();
    const minutes = Math.floor(stats.averageCallDuration / 60);
    const seconds = Math.floor(stats.averageCallDuration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  } catch (error) {
    console.error("Error fetching average call duration:", error);
    return "00:00";
  }
}

/**
 * Obtiene solo las conversaciones recientes
 */
export async function getTopConversations(): Promise<TopConversation[]> {
  try {
    const stats = await getDashboardStats();
    return stats.topConversations;
  } catch (error) {
    console.error("Error fetching top conversations:", error);
    return [];
  }
}

/**
 * Obtiene solo los motivos frecuentes
 */
export async function getTopFrequentMotives(): Promise<FrequentMotive[]> {
  try {
    const stats = await getDashboardStats();
    return stats.frequentMotives;
  } catch (error) {
    console.error("Error fetching frequent motives:", error);
    return [];
  }
}

/**
 * Obtiene solo los contactos recientes
 */
export async function getRecentContacts(): Promise<RecentContact[]> {
  try {
    const stats = await getDashboardStats();
    return stats.recentContacts;
  } catch (error) {
    console.error("Error fetching recent contacts:", error);
    return [];
  }
}

/**
 * Obtiene solo los datos históricos
 */
export async function getHistoricalData(): Promise<HistoricalData[]> {
  try {
    const stats = await getDashboardStats();
    return stats.historicalData;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    return [];
  }
}

/**
 * Suscribe a eventos de estadísticas del dashboard
 */
export function subscribeToStatsEvents(
  eventType: "statsConsulted",
  callback: (data: DashboardStats | WebSocketStatsMessage) => void,
): () => void {
  webSocketService.connect();
  const topic = "/topic/dashboard/stats/consulted";
  webSocketService.subscribe(topic, (message: WebSocketMessage) => {
    if (message.data) {
      callback(message.data as DashboardStats | WebSocketStatsMessage);
    }
  });
  return () => {
    webSocketService.unsubscribe(topic);
  };
}

/**
 * Desconecta el WebSocket de estadísticas
 */
export function disconnectStatsWebSocket(): void {
  webSocketService.disconnect();
}

/**
 * Obtiene llamadas y citas crudas desde /api/v1/stats/all
 */
export async function getAllStats(): Promise<AllStatsResponse> {
  try {
    const token = userService.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/stats/all`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener /api/v1/stats/all: ${response.status}`);
    }

    const json: unknown = await response.json();
    return normalizeAllStatsPayload(json);
  } catch (error) {
    console.error("Error fetching /api/v1/stats/all:", error);
    throw error;
  }
}
