import { API_BASE_URL } from "@/config/env";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  need?: string;
  message: string;
  company?: string; // campo honeypot para prevenir bots
}

export interface Request {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  need: string;
  message: string;
  referralCode: string;
  sellerId: string | null;
  status: string;
  submittedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface GetAllRequestsResponse {
  success: boolean;
  requests?: Request[];
  error?: string;
}

export interface GetRequestByIdResponse {
  success: boolean;
  request?: Request;
  error?: string;
}

export interface RequestStats {
  by_status: {
    pending: number;
    with_referral: number;
    completed: number;
  };
  basic_stats: {
    pending_rate: string;
    completion_rate: string;
    pending_requests: number;
    completed_requests: number;
    total_requests: number;
    requests_with_referral: number;
    referral_rate: string;
  };
}

export interface GetRequestStatsResponse {
  success: boolean;
  stats?: RequestStats;
  error?: string;
}

class RequestService {
  async sendContactEmail(data: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/contact-email`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      return {
        success: true,
        message: "Mensaje enviado correctamente",
        ...result,
      };
    } catch (error) {
      console.error("Error enviando formulario de contacto:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al enviar el mensaje",
      };
    }
  }

  async getAllRequests(): Promise<GetAllRequestsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const requests: Request[] = await response.json();

      return {
        success: true,
        requests,
      };
    } catch (error) {
      console.error("Error obteniendo solicitudes:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener las solicitudes",
      };
    }
  }

  async getRequestById(id: number | string): Promise<GetRequestByIdResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: "Solicitud no encontrada",
          };
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const request: Request = await response.json();

      return {
        success: true,
        request,
      };
    } catch (error) {
      console.error("Error obteniendo solicitud por ID:", error);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido al obtener la solicitud",
      };
    }
  }

  async getRequestStats(): Promise<GetRequestStatsResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/stats`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const stats: RequestStats = await response.json();

      return {
        success: true,
        stats,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas de solicitudes:", error);

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

export const requestService = new RequestService();

// Exportar métodos individuales para uso directo
export const getRequestStats =
  requestService.getRequestStats.bind(requestService);

export default RequestService;
