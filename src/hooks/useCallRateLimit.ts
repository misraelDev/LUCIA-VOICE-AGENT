'use client'

import { useState, useEffect, useCallback } from 'react'

const CALL_LIMIT = 6
// Contador GLOBAL (no por sección)
const STORAGE_KEY = 'retell_call_count_global'
const RESET_KEY = 'retell_call_reset_date'

// Verificar si el rate limit está habilitado desde variables de entorno
const isRateLimitEnabled = () => {
  const envValue = process.env.NEXT_PUBLIC_RATE_LIMIT_ENABLED
  // Si no está definido o es 'true', habilitar rate limit
  // Solo deshabilitar si es explícitamente 'false'
  return envValue !== 'false'
}

export interface CallRateLimitState {
  callCount: number
  isLimitReached: boolean
  remainingCalls: number
  resetDate: Date | null
  currentSection: string // mantenemos la propiedad para compatibilidad, siempre 'global'
}

export function useCallRateLimit() {
  const [state, setState] = useState<CallRateLimitState>({
    callCount: 0,
    isLimitReached: false,
    remainingCalls: CALL_LIMIT,
    resetDate: null,
    currentSection: 'global'
  })

  // (no-op) Mantener utilidades mínimas necesarias

  // Función para obtener la fecha de inicio del día siguiente
  const getTomorrowStart = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    return tomorrow
  }

  // Cargar estado desde localStorage
  const loadState = useCallback(() => {
    try {
      // Si el rate limit está deshabilitado, establecer estado para permitir llamadas ilimitadas
      if (!isRateLimitEnabled()) {
        console.log('🚫 Rate limit disabled, setting unlimited state')
        setState({
          callCount: 0,
          isLimitReached: false,
          remainingCalls: Infinity, // Llamadas ilimitadas
          resetDate: null,
          currentSection: 'global'
        })
        return
      }

      const storedResetDate = localStorage.getItem(RESET_KEY)
      const storedCount = localStorage.getItem(STORAGE_KEY)
      
      let callCount = 0
      let resetDate = getTomorrowStart()

      // Si hay una fecha de reset almacenada
      if (storedResetDate) {
        const storedDate = new Date(storedResetDate)
        
        // Si la fecha de reset ya pasó, reiniciar el contador
        if (storedDate <= new Date()) {
          callCount = 0
          resetDate = getTomorrowStart()
          localStorage.setItem(STORAGE_KEY, '0')
          localStorage.setItem(RESET_KEY, resetDate.toISOString())
        } else {
          // La fecha de reset aún no ha llegado, usar el contador almacenado
          callCount = Math.max(0, parseInt(storedCount || '0', 10))
          resetDate = storedDate
        }
      } else {
        // Primera vez, establecer fecha de reset para mañana
        resetDate = getTomorrowStart()
        localStorage.setItem(RESET_KEY, resetDate.toISOString())
      }

      const isLimitReached = callCount >= CALL_LIMIT
      const remainingCalls = Math.max(0, CALL_LIMIT - callCount)

      setState({
        callCount,
        isLimitReached,
        remainingCalls,
        resetDate,
        currentSection: 'global'
      })
    } catch (error) {
      console.error('Error loading call rate limit state:', error)
      // Estado por defecto en caso de error
      const resetDate = getTomorrowStart()
      setState({
        callCount: 0,
        isLimitReached: false,
        remainingCalls: CALL_LIMIT,
        resetDate,
        currentSection: 'global'
      })
    }
  }, [])

  // Incrementar contador de llamadas
  const incrementCallCount = useCallback(() => {
    console.log('🔄 incrementCallCount called')
    
    // Si el rate limit está deshabilitado, no incrementar contador
    if (!isRateLimitEnabled()) {
      console.log('🚫 Rate limit disabled, skipping counter increment')
      return
    }
    
    // GLOBAL: calificar desde un único contador
    const currentCount = Math.max(0, parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10))
    const newCount = currentCount + 1
    const isLimitReached = newCount >= CALL_LIMIT
    const remainingCalls = Math.max(0, CALL_LIMIT - newCount)

    console.log('📊 Incrementing call count (per section):', {
      section: 'global',
      previousCount: currentCount,
      newCount,
      isLimitReached,
      remainingCalls
    })

    localStorage.setItem(STORAGE_KEY, String(newCount))
    console.log('💾 Saved global count to localStorage:', newCount)

    setState(prev => ({
      ...prev,
      callCount: newCount,
      isLimitReached,
      remainingCalls
    }))
  }, [])

  // Verificar si se puede hacer una llamada
  const canMakeCall = useCallback(() => {
    // Si el rate limit está deshabilitado, siempre permitir llamadas
    if (!isRateLimitEnabled()) {
      return true
    }
    return !state.isLimitReached
  }, [state.isLimitReached])

  // Verificar límite directamente desde localStorage (más confiable)
  const checkLimitDirectly = useCallback(() => {
    // Si el rate limit está deshabilitado, siempre permitir llamadas
    if (!isRateLimitEnabled()) {
      return true
    }
    try {
      const currentCount = Math.max(0, parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10))
      return currentCount < CALL_LIMIT
    } catch {
      return true // En caso de error, permitir la llamada
    }
  }, [])

  // Disparar evento de límite alcanzado manualmente
  const triggerLimitReachedEvent = useCallback(() => {
    console.log('🚨 Triggering rate limit reached event')
    window.dispatchEvent(new CustomEvent('rateLimitReached', {
      detail: { callCount: state.callCount, callLimit: CALL_LIMIT }
    }))
  }, [state.callCount])

  // Función de debugging para verificar estado actual
  const debugCurrentState = useCallback(() => {
    const storedResetDate = localStorage.getItem(RESET_KEY)
    const currentCount = localStorage.getItem(STORAGE_KEY)
    
    console.log('🔍 Debug - Current state:', {
      reactState: state,
      localStorage: {
        count: currentCount,
        resetDate: storedResetDate
      }
    })
    
    return {
      reactState: state,
      localStorageCount: Math.max(0, parseInt(currentCount || '0', 10)),
      localStorageResetDate: storedResetDate
    }
  }, [state])

  // Función para sincronizar estado manualmente
  const syncState = useCallback(() => {
    console.log('🔄 Manual state sync requested')
    loadState()
  }, [loadState])

  // Resetear contador (para testing o casos especiales)
  const resetCount = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, '0')
    const resetDate = getTomorrowStart()
    localStorage.setItem(RESET_KEY, resetDate.toISOString())
    
    setState(prev => ({
      ...prev,
      callCount: 0,
      isLimitReached: false,
      remainingCalls: CALL_LIMIT,
      resetDate
    }))
  }, [])

  // Cambiar de sección explícitamente
  const switchSection = useCallback((_newSection: string) => {
    // Global: mantener 'global' como sección actual para compatibilidad
    setState(prev => ({ ...prev, currentSection: 'global' }))
  }, [])

  // Cargar estado al montar el componente
  useEffect(() => {
    loadState()
  }, [loadState])

  // Verificar periódicamente si necesitamos resetear el contador
  useEffect(() => {
    const checkReset = () => {
      const now = new Date()
      if (state.resetDate && now >= state.resetDate) {
        loadState() // Esto automáticamente reseteará si es necesario
      }
    }

    // Verificar cada minuto
    const interval = setInterval(checkReset, 60000)
    
    return () => clearInterval(interval)
  }, [state.resetDate, loadState])

  // Función para verificar si el rate limit está habilitado
  const isRateLimitActive = useCallback(() => {
    return isRateLimitEnabled()
  }, [])

  return {
    ...state,
    incrementCallCount,
    canMakeCall,
    checkLimitDirectly,
    triggerLimitReachedEvent,
    debugCurrentState,
    syncState,
    resetCount,
    callLimit: CALL_LIMIT,
    switchSection,
    isRateLimitActive
  }
}