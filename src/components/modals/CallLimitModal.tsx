'use client'

import React, { useEffect } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { createPortal } from 'react-dom'

interface CallLimitModalProps {
  isOpen: boolean
  onClose: () => void
  resetDate: Date | null
  callCount: number
  callLimit: number
}

const CallLimitModal: React.FC<CallLimitModalProps> = ({
  isOpen,
  onClose,
  resetDate,
  callLimit
}) => {
  useEffect(() => {
    console.log('🔍 CallLimitModal isOpen cambió:', isOpen)
  }, [isOpen])
  
  // Bloquear scroll cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Manejar escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const formatResetTime = (date: Date | null) => {
    if (!date) return 'mañana'
    
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60))
    
    if (diffHours <= 1) return 'en menos de 1 hora'
    if (diffHours < 24) return `en ${diffHours} horas`
    return 'mañana'
  }

  const handleScheduleDemo = () => {
    window.open('/contact', '_blank')
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Crear el contenido del modal
  const modalContent = (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Contenido */}
        <div className="p-6 pt-16">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ¿Te gustó lo que viste?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Has explorado todas las capacidades de nuestra demo. Ahora es el momento perfecto para 
              descubrir cómo Lucia puede transformar tu negocio con una solución personalizada.
            </p>
          </div>
          
          {/* Reset info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Nuevas pruebas disponibles {formatResetTime(resetDate)}
                </p>
                <p className="text-xs text-blue-600">
                  Podrás probar {callLimit} llamadas más después del reset diario
                </p>
              </div>
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="space-y-3">
            <button
              onClick={handleScheduleDemo}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5" />
              Agendar demo personalizada
            </button>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              ¿Tienes preguntas? Nuestro equipo está listo para ayudarte a implementar 
              la solución perfecta para tu empresa.
            </p>
            
            {/* Botón de reset para desarrollo */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={() => {
                  localStorage.removeItem('retell_call_count')
                  localStorage.removeItem('retell_call_reset_date')
                  window.location.reload()
                }}
                className="mt-2 text-xs text-red-500 hover:text-red-700 underline mx-auto block"
              >
                [DEV] Reset Counter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // Usar createPortal del lado del cliente
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}

export default React.memo(CallLimitModal)