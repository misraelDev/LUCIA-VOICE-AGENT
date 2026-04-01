"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useRetell } from '@/hooks/useRetell'
import { useCallRateLimit } from '@/hooks/useCallRateLimit'
import { RETELL_AGENTS } from '@/lib/retell-agents'
import { verifyAgentConfig } from '@/lib/verify-agents'
// Transcript tipado simple para compatibilidad visual tras migración
type Transcript = { speaker: 'user' | 'agent', text: string, isFinal?: boolean }

export interface AgentModel {
  id: string
  name: string
  description: string
  model: string
  externalVoice: {
    chatterbox: {
      modelVariant: 'turbo' | 'multilingual' | 'original'
      languageId?: string
      referenceAudioPath?: string
    }
  }
  selectedTools: string[]
  prompt: {
    templateFile: string
  }
  tools: unknown[]
  settings: {
    maxTokens: number
    temperature: number
  }
  vadSettings: {
    turnEndpointDelay: string
    minimumTurnDuration: string
    minimumInterruptionDuration: string
    frameActivationThreshold: number
  }
}

interface AgentContextType {
  activeModel: AgentModel | null
  setActiveModel: (model: AgentModel | null) => void
  isLoadingModel: boolean
  loadModel: (modelId: string) => Promise<AgentModel>
  isCallActive: boolean
  setIsCallActive: (active: boolean) => void
  startCall: (onMessage?: (message: string) => void) => Promise<void>
  stopCall: () => Promise<void>
  sendMessage: (message: string) => Promise<void>
  resetConversation: () => void
  // Estado de Ultravox
  ultravoxStatus: string
  transcripts: Transcript[]
  isUserSpeaking: boolean
  isRecording: boolean
  isProcessing: boolean
  isSpeaking: boolean
  isUltravoxReady: boolean
  // Rate limit
  callRateLimit: {
    callCount: number
    isLimitReached: boolean
    remainingCalls: number
    resetDate: Date | null
    canMakeCall: () => boolean
    checkLimitDirectly: () => boolean
    triggerLimitReachedEvent: () => void
    debugCurrentState?: () => unknown
    syncState?: () => void
    callLimit: number
    currentSection: string
    switchSection: (section: string) => void
    isRateLimitActive: () => boolean
  }
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

export const useAgent = () => {
  const context = useContext(AgentContext)
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider')
  }
  return context
}

interface AgentProviderProps {
  children: ReactNode
}

export const AgentProvider: React.FC<AgentProviderProps> = ({ children }: AgentProviderProps) => {
  const [activeModel, setActiveModel] = useState<AgentModel | null>(null)
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  
  // Usar Retell en lugar de Ultravox
  const retell = useRetell()
  
  // Rate limit hook
  const rateLimit = useCallRateLimit()
  
  // Hook para detectar cambios de ruta
  const pathname = usePathname()
  const [previousPathname, setPreviousPathname] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const loadModel = useCallback(async (modelId: string) => {
    console.log(`🔄 Starting model load for case: ${modelId}`)
    setIsLoadingModel(true)
    try {
      // Mapeo de casos/aliases a IDs de agentes
      const modelMapping: Record<string, string> = {
        hoteleria: 'hoteles',
        hoteles: 'hoteles',
        clinicas: 'clinica',
        clinica: 'clinica',
        inmobiliarias: 'inmobiliaria',
        inmobiliaria: 'inmobiliaria',
        ecommerce: 'ecommerce',
        ventas: 'ventas',
        // Aliases sin agente propio aún
        callcenters: 'hoteles',
        restaurantes: 'hoteles',
        experiencia: 'hoteles',
      }

      const actualModelId = modelMapping[modelId] ?? modelId
      console.log(`📋 Mapped case "${modelId}" to model ID: "${actualModelId}"`)
      
      // Cargar el modelo desde la API
      console.log(`🌐 Fetching model from /api/agents/${actualModelId}`)
      const response = await fetch(`/api/agents/${actualModelId}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ API Error: ${response.status} - ${errorText}`)
        throw new Error(`Failed to load model: ${response.status} - ${errorText}`)
      }
      
      const model: AgentModel = await response.json()
      console.log(`✅ Model loaded successfully: ${model.name} (ID: ${model.id})`)
      
      // Actualizar el modelo activo
      setActiveModel(model)
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('activeAgentModel', JSON.stringify(model))
      localStorage.setItem('activeCaseId', modelId)
      
      console.log(`💾 Model saved to localStorage: ${model.name}`)
      console.log(`🎯 Active model updated: ${model.name}`)
      
      return model
    } catch (error) {
      console.error('❌ Error loading model:', error)
      // No hacer fallback silencioso a 'hoteles'
      throw error // Re-throw para que el componente pueda manejar el error
    } finally {
      setIsLoadingModel(false)
      console.log('🏁 Model loading process completed')
    }
  }, [])

  // Métodos para manejar llamadas con Retell
  const startCall = useCallback(async () => {
    if (!activeModel) {
      throw new Error('No agent model loaded')
    }
    
    // Verificar si el rate limit está habilitado
    const isRateLimitEnabled = rateLimit.isRateLimitActive()
    console.log('🔍 Rate limit status:', { enabled: isRateLimitEnabled })
    
    // Verificar rate limit antes de iniciar la llamada (usando verificación directa)
    if (isRateLimitEnabled && !rateLimit.checkLimitDirectly()) {
      console.warn('🚨 Rate limit exceeded (direct check)')
      // Disparar evento para mostrar modal
      rateLimit.triggerLimitReachedEvent()
      throw new Error('RATE_LIMIT_EXCEEDED')
    }
    
    try {
      setIsCallActive(true)
      // Mapear id del modelo a agent_id de Retell
      const agentId = (RETELL_AGENTS as Record<string, string>)[activeModel.id] || RETELL_AGENTS.hoteles
      const started = await retell.startCall(agentId)
      if (!started) {
        // Ya había un inicio en curso; cancelar flujo sin incrementar
        setIsCallActive(true)
        return
      }
      
      // Incrementar contador solo si la llamada se inició exitosamente
      console.log('📞 Call started successfully, incrementing counter...')
      console.log('📊 Current rate limit state before increment:', {
        callCount: rateLimit.callCount,
        isLimitReached: rateLimit.isLimitReached,
        remainingCalls: rateLimit.remainingCalls
      })
      
      rateLimit.incrementCallCount()
      
      console.log('✅ incrementCallCount() called')
      
      // Sincronizar estado después de un pequeño delay
      setTimeout(() => {
        console.log('🔄 Syncing state after call increment')
        if (rateLimit.syncState) {
          rateLimit.syncState()
        }
      }, 200)
    } catch (error) {
      setIsCallActive(false)
      throw error
    }
  }, [activeModel, retell, rateLimit])

  const stopCall = useCallback(async () => {
    retell.stopCall()
    setIsCallActive(false)
  }, [retell])

  const resetConversation = useCallback(() => {
    retell.resetState()
  }, [retell])

  const sendMessage = async (): Promise<void> => {
    // Retell: no envío de texto directo en este flujo web
  }

  // Detectar cambios de ruta y terminar llamadas activas
  useEffect(() => {
    // Solo procesar si ya se inicializó el contexto
    if (!isInitialized) return
    
    if (previousPathname !== null && previousPathname !== pathname) {
      // Si hay una llamada activa, terminarla automáticamente
      if (isCallActive) {
        console.log('📞 Terminating active call due to route change...')
        retell.stopCall()
        setIsCallActive(false)
        console.log('✅ Call terminated due to route change')
      }
    }
    
    // Actualizar la ruta anterior
    setPreviousPathname(pathname)
  }, [pathname, previousPathname, isCallActive, isInitialized, retell])

  // Sincronizar modelo activo con la ruta actual SIEMPRE (si hay llamada, la detiene y cambia el modelo)
  useEffect(() => {
    if (!isInitialized) return

    const path = pathname || '/'
    const pathToCase: Record<string, string> = {
      '/hotels': 'hoteles',
      '/clinics': 'clinicas',
      '/real-estate': 'inmobiliarias',
      '/ecommerce': 'ecommerce',
      '/sales': 'ventas',
    }

    const matchedCase = Object.keys(pathToCase).find((p) => path.startsWith(p))
    const desiredCaseId = matchedCase ? pathToCase[matchedCase] : 'hoteles'

    const sync = async () => {
      try {
        const savedCaseId = localStorage.getItem('activeCaseId')
        if (desiredCaseId && savedCaseId !== desiredCaseId) {
          console.log(`🎯 Path suggests case "${desiredCaseId}" but saved is "${savedCaseId}". Forcing load...`)
          if (isCallActive) {
            console.log('📞 Active call detected, terminating before model load...')
            retell.stopCall()
            setIsCallActive(false)
          }
          await loadModel(desiredCaseId)
        }
      } catch {
        if (desiredCaseId) {
          if (isCallActive) {
            retell.stopCall()
            setIsCallActive(false)
          }
          await loadModel(desiredCaseId).catch((err) => console.error('❌ Error syncing model with path (fallback):', err))
        }
      }
    }

    void sync()
  }, [pathname, isInitialized, isCallActive, loadModel, retell, setIsCallActive])

  // Cargar modelo desde localStorage al inicializar (solo una vez)
  useEffect(() => {
    if (!isInitialized) {
      const initializeAgent = async () => {
        console.log('🚀 Initializing agent context...')
        
        // Verificar configuración de agentes
        verifyAgentConfig()
        
        const savedModel = localStorage.getItem('activeAgentModel')
        const savedCaseId = localStorage.getItem('activeCaseId')
        
        if (savedModel && savedCaseId) {
          try {
            console.log('📦 Restoring saved model from localStorage...')
            const model: AgentModel = JSON.parse(savedModel)
            setActiveModel(model)
            console.log(`✅ Restored model: ${model.name} (ID: ${model.id})`)
          } catch (error) {
            console.error('❌ Error parsing saved model:', error)
            // Cargar modelo por defecto
            console.log('🔄 Loading default model due to parsing error...')
            await loadModel('hoteles')
          }
        } else {
          // Cargar modelo por defecto si no hay ninguno guardado
          console.log('🔄 No saved model found, loading default model...')
          await loadModel('hoteles')
        }
        
        setIsInitialized(true)
      }

      initializeAgent()
    }
  }, [isInitialized, loadModel])

  return (
    <AgentContext.Provider 
      value={{ 
        activeModel, 
        setActiveModel, 
        isLoadingModel, 
        loadModel,
        isCallActive,
        setIsCallActive,
        startCall,
        stopCall,
        resetConversation,
        sendMessage,
        // Estado mapeado desde Retell
        ultravoxStatus: retell.isCalling 
          ? (retell.isAgentSpeaking ? 'speaking' : 'connected')
          : 'disconnected',
        transcripts: (retell.transcript as unknown as Transcript[]),
        isUserSpeaking: false,
        isRecording: retell.isCalling,
        isProcessing: retell.isAgentSpeaking,
        isSpeaking: retell.isAgentSpeaking,
        isUltravoxReady: true,
        // Rate limit
        callRateLimit: {
          callCount: rateLimit.callCount,
          isLimitReached: rateLimit.isLimitReached,
          remainingCalls: rateLimit.remainingCalls,
          resetDate: rateLimit.resetDate,
          canMakeCall: rateLimit.canMakeCall,
          checkLimitDirectly: rateLimit.checkLimitDirectly,
          triggerLimitReachedEvent: rateLimit.triggerLimitReachedEvent,
          debugCurrentState: rateLimit.debugCurrentState,
          syncState: rateLimit.syncState,
          callLimit: rateLimit.callLimit,
          currentSection: rateLimit.currentSection,
          switchSection: rateLimit.switchSection,
          isRateLimitActive: rateLimit.isRateLimitActive
        }
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}
