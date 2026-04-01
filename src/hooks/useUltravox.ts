'use client'

import { useState, useEffect, useCallback } from 'react'
import { Transcript, CallResponse } from '@/types/ultravox'
import { toast } from 'sonner'
import { useRateLimit } from './use-rate-limit'

export function useUltravox() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)
  const [status, setStatus] = useState<string>('disconnected')
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isCreatingCall, setIsCreatingCall] = useState(false)
  const [currentCall, setCurrentCall] = useState<CallResponse | null>(null)
  const [microphonePermission, setMicrophonePermission] = useState<'unknown' | 'granted' | 'denied'>('unknown')
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [isUltravoxReady, setIsUltravoxReady] = useState(false)
  
  // 🚦 Rate Limiting Integration
  const { isRateLimited, rateLimitData, handleApiCall, closeRateLimitModal } = useRateLimit()

  useEffect(() => {
    checkMicrophonePermission()
    waitForUltravox()
  }, [])

  const waitForUltravox = () => {
    const checkUltravox = () => {
      if (window.UltravoxSession) {
        console.log('Ultravox SDK is ready')
        setIsUltravoxReady(true)
      } else {
        console.log('Waiting for Ultravox SDK...')
        setTimeout(checkUltravox, 100)
      }
    }
    checkUltravox()
  }

  const checkMicrophonePermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
      setMicrophonePermission(permission.state as 'granted' | 'denied')

      permission.addEventListener('change', () => {
        setMicrophonePermission(permission.state as 'granted' | 'denied')
      })
    } catch (error) {
      console.log('Could not check microphone permission:', error)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      console.log('🎤 Requesting microphone permission...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Detener todas las pistas inmediatamente después de obtener el permiso
      stream.getTracks().forEach(track => track.stop())
      
      setMicrophonePermission('granted')
      console.log('✅ Microphone permission granted')
      return true
    } catch (error) {
      console.log('❌ Microphone permission denied:', error)
      setMicrophonePermission('denied')
      return false
    }
  }

  const createCall = useCallback(async (agentId?: string): Promise<CallResponse | null> => {
    setIsCreatingCall(true)
    try {
      console.log('Creating call with agent:', agentId || 'default')

      // 🚦 Usar handleApiCall para manejar rate limiting
      const response = await handleApiCall(() => 
        fetch('/api/calls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ agentId })
        })
      )

      // Si es null, significa que se alcanzó el rate limit
      if (!response) {
        return null
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        if (response.status === 402) {
          toast.error('Comunícate con el equipo de soporte', {
            description: 'Error 402',
          })
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const callData: CallResponse = await response.json()
      console.log('Call created successfully:', callData)
      setCurrentCall(callData)

      return callData
    } catch (error) {
      console.error('Error creating call:', error)
      throw error
    } finally {
      setIsCreatingCall(false)
    }
  }, [handleApiCall])

  const connectToCall = useCallback(async (joinUrl: string) => {
    try {
      // Esperar a que Ultravox esté listo
      if (!isUltravoxReady) {
        console.log('Waiting for Ultravox to be ready...')
        await new Promise<void>((resolve) => {
          const checkReady = () => {
            if (window.UltravoxSession) {
              resolve()
            } else {
              setTimeout(checkReady, 100)
            }
          }
          checkReady()
        })
      }

      // Verificar que el SDK esté disponible
      if (!window.UltravoxSession) {
        throw new Error('UltravoxSession no está disponible. Recarga la página.')
      }

      console.log('Inicializando UltravoxSession...')

      // Crear sesión exactamente como en el script de Python
      const debugMessages = new Set(["debug"])
      const newSession = new window.UltravoxSession({ experimentalMessages: debugMessages })

      // Event listeners exactamente como en el script de Python
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newSession.addEventListener('status', (e: any) => {
        console.log('Status changed:', e.target._status)
        setStatus(e.target._status)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newSession.addEventListener('transcripts', (e: any) => {
        console.log('Transcripts updated:', e.target._transcripts)
        const transcripts = e.target._transcripts
        if (transcripts && Array.isArray(transcripts)) {
          // Mostrar TODOS los transcripts, incluyendo los parciales
          setTranscripts([...transcripts])

          // Detectar si el usuario está hablando (transcript parcial del usuario)
          const latestTranscript = transcripts[transcripts.length - 1]
          if (latestTranscript && latestTranscript.speaker === 'user' && !latestTranscript.isFinal) {
            setIsUserSpeaking(true)
          } else {
            setIsUserSpeaking(false)
          }
        }
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newSession.addEventListener('experimental_message', (msg: any) => {
        console.log('Debug: ', JSON.stringify(msg))
      })

      console.log('Joining call with URL:', joinUrl)
      const callStatus = await newSession.joinCall(joinUrl)
      console.log('Call status:', callStatus)

      setSession(newSession)
    } catch (error) {
      console.error('Error connecting to Ultravox:', error)
      throw error
    }
  }, [isUltravoxReady])

  const disconnect = useCallback(async () => {
    console.log('Disconnecting from Ultravox call...')
    if (session) {
      try {
        console.log('Leaving call...')
        await session.leaveCall()
        console.log('Call ended successfully')
      } catch (error) {
        console.error('Error leaving call:', error)
        // Continuar con la limpieza incluso si hay error
      } finally {
        // Siempre limpiar el estado
        console.log('Cleaning up session state...')
        setSession(null)
        setTranscripts([])
        setCurrentCall(null)
        setStatus('disconnected')
        setIsUserSpeaking(false)
      }
    } else {
      console.log('No active session to disconnect')
      // Limpiar estado incluso si no hay sesión
      setSession(null)
      setTranscripts([])
      setCurrentCall(null)
      setStatus('disconnected')
      setIsUserSpeaking(false)
    }
  }, [session])

  const isConnected = status !== 'disconnected'
  const isRecording = status === 'listening'
  const isProcessing = status === 'thinking' || status === 'connecting' || status === 'idle'
  const isSpeaking = status === 'speaking'

  return {
    // Estado
    session,
    status,
    transcripts,
    currentCall,
    microphonePermission,
    isUserSpeaking,
    isCreatingCall,
    isConnected,
    isRecording,
    isProcessing,
    isSpeaking,
    isUltravoxReady,
    
    // 🚦 Rate Limiting Estado
    isRateLimited,
    rateLimitData,
    closeRateLimitModal,
    
    // Acciones
    createCall,
    connectToCall,
    disconnect,
    requestMicrophonePermission,
    
    // Utilidades
    clearTranscripts: () => setTranscripts([])
  }
}
