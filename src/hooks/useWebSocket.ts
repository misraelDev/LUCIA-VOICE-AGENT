import { useEffect, useState, useCallback, useRef } from 'react'
import { webSocketService, type RequestData } from '@/services/WebSocketService'

export interface UseWebSocketOptions {
  onNewRequest?: (request: RequestData) => void
  onUpdatedRequest?: (request: RequestData) => void
  autoConnect?: boolean
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onNewRequest,
    onUpdatedRequest,
    autoConnect = true
  } = options

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const isSubscribed = useRef(false)

  const connect = useCallback(() => {
    webSocketService.connect()
    setConnectionStatus('connecting')
  }, [])

  const disconnect = useCallback(() => {
    webSocketService.disconnect()
    setConnectionStatus('disconnected')
    isSubscribed.current = false
  }, [])

  const subscribe = useCallback(() => {
    if (isSubscribed.current) return

    webSocketService.subscribeToRequests({
      onNew: (newRequest) => {
        onNewRequest?.(newRequest)
      },
      onUpdated: (updatedRequest) => {
        onUpdatedRequest?.(updatedRequest)
      }
    })

    isSubscribed.current = true
    setConnectionStatus('connected')
  }, [onNewRequest, onUpdatedRequest])

  // Conectar automáticamente si autoConnect es true
  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      if (autoConnect) {
        disconnect()
      }
    }
  }, [autoConnect, connect, disconnect])

  // Suscribirse cuando se conecte
  useEffect(() => {
    if (connectionStatus === 'connecting') {
      // Pequeño delay para asegurar que la conexión esté establecida
      const timer = setTimeout(() => {
        subscribe()
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [connectionStatus, subscribe])

  return {
    connectionStatus,
    connect,
    disconnect,
    subscribe
  }
}
