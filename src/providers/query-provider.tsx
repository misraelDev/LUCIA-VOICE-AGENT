"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Con React Query, los datos se cachean automáticamente
            staleTime: 1000 * 60 * 5, // 5 minutos - los datos se consideran "frescos" por 5 minutos
            gcTime: 1000 * 60 * 10, // 10 minutos - tiempo de garbage collection (antes cacheTime)
            refetchOnWindowFocus: false, // No refetch cuando la ventana recupera el foco
            refetchOnReconnect: true, // Refetch cuando se reconecta a internet
            retry: 1, // Reintentar 1 vez en caso de error
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

