import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getDashboardStats,
  getAllStats,
  subscribeToStatsEvents,
  disconnectStatsWebSocket,
  type DashboardStats,
  type AllStatsResponse,
  type WebSocketStatsMessage,
  type TopConversation,
  type FrequentMotive,
  type RecentContact,
  type HistoricalData,
} from "@/services/StatsService"
import { useEffect } from "react"

// Re-exportar tipos para facilitar su uso
export type {
  TopConversation,
  FrequentMotive,
  RecentContact,
  DashboardStats,
  AllStatsResponse,
  HistoricalData,
}

// Query keys para React Query
export const statsKeys = {
  all: ["stats"] as const,
  dashboard: () => [...statsKeys.all, "dashboard"] as const,
  allStats: () => [...statsKeys.all, "all"] as const,
}

/**
 * Hook para obtener las estadísticas del dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: statsKeys.dashboard(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutos - los datos se consideran frescos por 2 minutos
  })
}

/**
 * Hook para obtener todas las estadísticas (llamadas y citas crudas)
 */
export function useAllStats() {
  return useQuery({
    queryKey: statsKeys.allStats(),
    queryFn: getAllStats,
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

/**
 * Hook para suscribirse a actualizaciones de estadísticas vía WebSocket
 * y actualizar el cache de React Query automáticamente
 */
export function useStatsWebSocket() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribeStatsUpdated = subscribeToStatsEvents(
      "statsConsulted",
      (message) => {
        console.log("Dashboard stats updated via WebSocket:", message)

        // Extraer los datos del mensaje WebSocket
        const stats =
          "dashboardStats" in message ? message.dashboardStats : message

        // Actualizar el cache de React Query con los nuevos datos
        // (no invalidar queries: eso dispararía un re-fetch → nuevo WS → ciclo infinito)
        queryClient.setQueryData<DashboardStats>(
          statsKeys.dashboard(),
          (oldData) => {
            return oldData ? { ...oldData, ...stats } : stats
          }
        )
      }
    )

    // Cleanup: desuscribirse y desconectar WebSocket
    return () => {
      unsubscribeStatsUpdated()
      disconnectStatsWebSocket()
    }
  }, [queryClient])
}

/**
 * Hook combinado que devuelve las estadísticas del dashboard
 * y se suscribe automáticamente a actualizaciones vía WebSocket
 */
export function useDashboardStatsWithWebSocket() {
  const statsQuery = useDashboardStats()
  useStatsWebSocket()

  return statsQuery
}

