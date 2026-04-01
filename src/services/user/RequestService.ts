const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Interfaces para las estadísticas de solicitudes del seller
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

class SellerRequestService {
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

export const sellerRequestService = new SellerRequestService();

// Exportar método para uso directo
export const getRequestStats =
  sellerRequestService.getRequestStats.bind(sellerRequestService);

export default SellerRequestService;
