'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export interface TranscriptLine {
  speaker: 'user' | 'agent'
  text: string
}

export function useRetell() {
  const [isCalling, setIsCalling] = useState(false)
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const retellRef = useRef<any>(null) // eslint-disable-line @typescript-eslint/no-explicit-any
  const isInitializingRef = useRef(false)
  const lastStateChangeRef = useRef<number>(0)

  const RetellWebClient = useMemo(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
      return require('retell-client-js-sdk').RetellWebClient
    } catch {
      return null
    }
  }, [])

  // Evita dobles inicios por clics rápidos o renders en dev
  const startInProgressRef = useRef(false)

  useEffect(() => {
    if (!RetellWebClient || isInitializingRef.current) return
    
    if (!retellRef.current) {
      isInitializingRef.current = true
      console.log('🔧 Initializing Retell client...')
      
      try {
        retellRef.current = new RetellWebClient()
        const client = retellRef.current

        client.on('call_started', () => {
          console.log('📞 Retell call started')
          const now = Date.now()
          lastStateChangeRef.current = now
          setTimeout(() => {
            // Solo actualizar si no hubo cambios de estado más recientes
            if (lastStateChangeRef.current === now) {
              setIsCalling(true)
            }
          }, 100)
        })
        
        client.on('call_ended', () => {
          console.log('📞 Retell call ended')
          const now = Date.now()
          lastStateChangeRef.current = now
          setTimeout(() => {
            if (lastStateChangeRef.current === now) {
              setIsCalling(false)
              setIsAgentSpeaking(false)
              setTranscript([])
            }
          }, 100)
        })
        
        client.on('agent_start_talking', () => {
          console.log('🗣️ Agent started talking')
          setIsAgentSpeaking(true)
        })
        
        client.on('agent_stop_talking', () => {
          console.log('🤐 Agent stopped talking')
          setIsAgentSpeaking(false)
        })
        
        client.on('update', (update: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          if (update?.transcript) {
            const last = update.transcript[update.transcript.length - 1]
            if (last?.role && last?.content) {
              setTranscript((prev) => {
                // Evitar duplicados
                const exists = prev.some(t => t.text === last.content && t.speaker === (last.role === 'agent' ? 'agent' : 'user'))
                if (exists) return prev
                
                return [
                  ...prev,
                  { speaker: last.role === 'agent' ? 'agent' : 'user', text: last.content },
                ]
              })
            }
          }
        })
        
        client.on('error', (error: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          console.error('❌ Retell error:', error)
          setIsCalling(false)
          setIsAgentSpeaking(false)
        })
        
        console.log('✅ Retell client initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize Retell client:', error)
      } finally {
        isInitializingRef.current = false
      }
    }

    // Cleanup function para cuando el componente se desmonte
    return () => {
      if (retellRef.current) {
        console.log('🧹 Cleaning up Retell client on unmount')
        try {
          retellRef.current.stopCall()
          // Limpiar referencias
          retellRef.current = null
        } catch (error) {
          console.log('Error during cleanup:', error)
        }
      }
      isInitializingRef.current = false
    }
  }, [RetellWebClient])

  const startCall = async (
    agentId: string,
    extra?: { metadata?: Record<string, unknown>, retell_llm_dynamic_variables?: Record<string, unknown> }
  ): Promise<boolean> => {
    if (!retellRef.current) throw new Error('Retell SDK not available')
    if (startInProgressRef.current) {
      console.warn('🚫 Start call ignored: already in progress')
      return false
    }
    startInProgressRef.current = true
    
    // Si ya hay una llamada activa, terminarla primero
    if (isCalling) {
      console.log('⚠️ Terminating existing call before starting new one...')
      retellRef.current.stopCall()
      setIsCalling(false)
      setIsAgentSpeaking(false)
      // Pequeña pausa para asegurar que la llamada anterior se termine completamente
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log('🚀 Starting call with agent:', agentId, extra)
    
    const resp = await fetch('/api/retell/create-web-call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, ...(extra || {}) }),
    })
    
    console.log('📡 API response status:', resp.status)
    
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}))
      console.error('❌ API Error:', errorData)
      throw new Error(`Failed to create web call: ${JSON.stringify(errorData)}`)
    }
    
    try {
      const data = await resp.json()
      console.log('✅ API response data:', data)
      
      if (!data?.access_token) throw new Error('Missing access_token')
      await retellRef.current.startCall({ accessToken: data.access_token })
      return true
    } finally {
      startInProgressRef.current = false
    }
  }

  const stopCall = () => {
    if (!retellRef.current) return
    console.log('🛑 Stopping Retell call...')
    retellRef.current.stopCall()
    setIsCalling(false)
    setIsAgentSpeaking(false)
    setTranscript([])
    startInProgressRef.current = false
  }

  const clearTranscript = () => setTranscript([])

  const resetState = () => {
    console.log('🔄 Resetting Retell state...')
    setIsCalling(false)
    setIsAgentSpeaking(false)
    setTranscript([])
  }

  return {
    isCalling,
    isAgentSpeaking,
    transcript,
    startCall,
    stopCall,
    clearTranscript,
    resetState,
  }
}


