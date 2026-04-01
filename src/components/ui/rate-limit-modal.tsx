'use client'

import { useEffect, useState } from 'react'
import { X, Clock, MessageCircle } from 'lucide-react'

interface RateLimitModalProps {
    isOpen: boolean
    onClose: () => void
    resetTime?: string
}

export function RateLimitModal({ isOpen, onClose, resetTime }: RateLimitModalProps) {
    const [timeLeft, setTimeLeft] = useState<string>('')

    useEffect(() => {
        if (!resetTime || !isOpen) return

        const updateTimeLeft = () => {
            const now = new Date().getTime()
            const reset = new Date(resetTime).getTime()
            const difference = reset - now

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60))
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
                setTimeLeft(`${hours}h ${minutes}m`)
            } else {
                setTimeLeft('Ya disponible')
            }
        }

        updateTimeLeft()
        const interval = setInterval(updateTimeLeft, 60000) // Actualizar cada minuto

        return () => clearInterval(interval)
    }, [resetTime, isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-full">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Límite Alcanzado</h2>
                            <p className="text-orange-100 text-sm">Demo diaria completada</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="text-orange-500" size={32} />
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Por hoy ha usado la demo al <span className="font-semibold text-orange-600">máximo posible</span>. 
                            Si quiere más, escríbanos por las vías competentes para solicitar una 
                            <span className="font-semibold text-blue-600"> demo personalizada</span> o 
                            <span className="font-semibold text-green-600"> contratar nuestros servicios</span>.
                        </p>

                        {timeLeft && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-600">
                                    Próximo reinicio en: <span className="font-mono font-semibold text-orange-600">{timeLeft}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            Entendido
                        </button>
                        <button
                            onClick={() => {
                                // Aquí puedes agregar lógica para contacto
                                window.open('mailto:mdelrey@sarexlabs.com?subject=Solicitud de Demo Personalizada', '_blank')
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}