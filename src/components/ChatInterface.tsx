"use client"
import React, { useMemo } from "react"
import { Mic, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useAgent } from "@/contexts/agent-context"
import CallLimitModal from "@/components/modals/CallLimitModal"

interface ChatInterfaceProps {
  t: (key: string) => string
  showChat: boolean
  setShowChat: (show: boolean) => void
  rotatingTexts?: string[]
  sectionId: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  t, 
  showChat, 
  setShowChat, 
  rotatingTexts, 
  sectionId 
}) => {
  const { 
    isCallActive, 
    startCall, 
    stopCall, 
    isUltravoxReady, 
    transcripts, 
    isUserSpeaking, 
    isRecording, 
    ultravoxStatus,
    activeModel,
    isLoadingModel,
    callRateLimit,
    resetConversation
  } = useAgent()

  const [isLoading, setIsLoading] = React.useState(false)
  const [isStopping, setIsStopping] = React.useState(false)
  const [showRateLimitModal, setShowRateLimitModal] = React.useState(false)
  const [isCooldown, setIsCooldown] = React.useState(false)
  const loadingTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  // Función para determinar si hay audio reproduciéndose
  const isAudioPlaying = useMemo(() => {
    return isUserSpeaking || 
           ultravoxStatus === 'speaking' || 
           isRecording ||
           ultravoxStatus === 'thinking'
  }, [isUserSpeaking, ultravoxStatus, isRecording])

  // Efecto para manejar cambio de sección
  React.useEffect(() => {
    console.log(`🔄 ChatInterface mounted/updated for section: ${sectionId}`)
    
    if (callRateLimit.switchSection) {
      callRateLimit.switchSection(sectionId)
    }

    if (isCallActive) {
      console.log('🛑 Active call detected during section change, stopping...')
      stopCall().then(() => {
        console.log('✅ Previous call stopped due to section change')
        setIsLoading(false)
        setIsStopping(false)
        resetConversation()
      }).catch((error) => {
        console.error('❌ Error stopping call during section change:', error)
        setIsLoading(false)
        setIsStopping(false)
        resetConversation()
      })
    }
    if (!isCallActive) {
      resetConversation()
    }
  }, [sectionId])

  // Listener para el evento personalizado de rate limit
  React.useEffect(() => {
    const handleRateLimitReached = (event: CustomEvent) => {
      console.log('🚨 Rate limit event received:', event.detail)
      if (!event.detail.section || event.detail.section === sectionId) {
        // Usar requestAnimationFrame para asegurar que el estado se actualice correctamente
        requestAnimationFrame(() => {
          setShowRateLimitModal(true)
        })
      }
    }

    window.addEventListener('rateLimitReached', handleRateLimitReached as EventListener)
    
    return () => {
      window.removeEventListener('rateLimitReached', handleRateLimitReached as EventListener)
    }
  }, [sectionId])

  // Textos que se van a mostrar en rotación
  const texts = useMemo(() => 
    rotatingTexts || [
      "Calificación de prospectos",
      "Agendamiento de reuniones",
      "Seguimiento de leads",
      "Reportes de conversión",
      "Estrategias de venta",
    ], [rotatingTexts])

  const [currentTextIndex, setCurrentTextIndex] = React.useState(0)
  const [displayText, setDisplayText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Procesar transcripciones para evitar duplicados
  const processedTranscripts = useMemo(() => {
    if (!transcripts.length) return []
    
    const processed = []
    let currentMessage = null
    
    for (const transcript of transcripts) {
      if (!transcript || !transcript.speaker || !transcript.text) continue
      
      if (currentMessage && 
          currentMessage.speaker === transcript.speaker && 
          !currentMessage.isFinal) {
        processed[processed.length - 1] = transcript
        currentMessage = transcript
      } else {
        processed.push(transcript)
        currentMessage = transcript
      }
    }
    
    return processed
  }, [transcripts])

  // Animación de typing
  React.useEffect(() => {
    const currentFullText = texts[currentTextIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentFullText.length) {
            setDisplayText(currentFullText.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), 1500)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTextIndex, texts])

  // Auto-scroll to bottom when new transcripts arrive
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [processedTranscripts])

  // Cleanup function
  const cleanup = () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = undefined
    }
  }

  React.useEffect(() => {
    return cleanup
  }, [])

  const handleStartConversation = async () => {
    try {
      if (!activeModel) {
        console.error("❌ No active model loaded")
        return
      }

      if (isCallActive) {
        console.warn("⚠️ Call already active, ignoring start request")
        return
      }

      const canMakeCallDirect = callRateLimit.checkLimitDirectly()
      const isRateLimitEnabled = callRateLimit.isRateLimitActive()
      console.log(`🔍 Checking rate limit for section ${sectionId}:`, {
        canMakeCallReact: callRateLimit.canMakeCall(),
        canMakeCallDirect: canMakeCallDirect,
        isLimitReachedReact: callRateLimit.isLimitReached,
        callCountReact: callRateLimit.callCount,
        callLimit: callRateLimit.callLimit,
        currentSection: callRateLimit.currentSection,
        isRateLimitEnabled: isRateLimitEnabled
      })
      
      if (isRateLimitEnabled && !canMakeCallDirect) {
        console.warn(`⚠️ Rate limit reached for section ${sectionId}, showing modal`)
        setShowRateLimitModal(true)
        return
      }

      cleanup()

      console.log(`🚀 Starting conversation with model: ${activeModel.name} in section: ${sectionId}`)
      setIsLoading(true)
      setShowChat(true)

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          setTimeout(() => resolve(), 50)
        })
      })

      await startCall(
        (message) => {
          console.log("Received message from Retell:", message)
        }
      )

      setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      console.log(`✅ Conversation started successfully for section: ${sectionId}`)
    } catch (error) {
      console.error("❌ Error starting conversation:", error)
      
      if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
        setShowRateLimitModal(true)
      }
      
      setIsLoading(false)
      cleanup()
    }
  }

  const handleStopConversation = async () => {
    console.log(`🛑 Stopping conversation for section: ${sectionId}...`)
    setIsStopping(true)

    const safetyTimeout = setTimeout(() => {
      console.log("Safety timeout reached, forcing cleanup...")
      setIsStopping(false)
      cleanup()
    }, 10000)

    try {
      await stopCall()
      console.log(`✅ Conversation stopped successfully for section: ${sectionId}`)
      resetConversation()
      setIsCooldown(true)
      setTimeout(() => setIsCooldown(false), 3000)
    } catch (error) {
      console.error("❌ Error stopping call:", error)
    } finally {
      clearTimeout(safetyTimeout)
      setIsStopping(false)
      cleanup()
    }
  }

  // Función para formatear el texto con saltos de línea
  const formatTextWithLineBreaks = (text: string) => {
    if (!text) return ""
    const normalized = text.replace(/\n+/g, " ").trim()
    return normalized
      .split(/(?<=[.!?…])\s+/)
      .map(s => s.trim())
      .filter(Boolean)
      .join('\n')
  }

  const handleCloseModal = () => {
    console.log('🔍 Closing modal')
    setShowRateLimitModal(false)
  }

  if (showChat) {
    return (
      <>
        <div className="w-full max-w-[400px] sm:max-w-[441px] mx-auto relative">
          {/* Main container */}
          <div className="relative bg-white rounded-t-[30px] sm:rounded-t-[39px] rounded-b-none h-[500px] sm:h-[571px] shadow-2xl">
            {/* Header */}
            <div className="absolute top-[18px] sm:top-[23px] left-3 sm:left-4 md:left-[24px] flex items-center gap-2 sm:gap-3">
              <div className="w-[45px] h-[48px] sm:w-[53px] sm:h-[55.9px] relative overflow-hidden flex items-center justify-center">
                <div className="w-[45px] h-[45px] sm:w-[53px] sm:h-[53px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Image
                    src="/lucia-intelligent.png"
                    alt="LucIA Avatar"
                    width={35}
                    height={35}
                    className="rounded-full object-cover sm:w-10 sm:h-10"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-lg sm:text-xl font-bold text-indigo-600">Lucia</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-600 -mt-1">
                  {isLoadingModel ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Cargando modelo...
                    </span>
                  ) : activeModel ? (
                    activeModel.name
                  ) : (
                    "Asistente de Voz de Sarex"
                  )}
                </div>
              </div>
            </div>

            {/* Voice indicator */}
            <div className="absolute top-[85px] sm:top-[100px] left-1/2 transform -translate-x-1/2">
              <div className="flex items-center justify-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      (isRecording || isUserSpeaking || ultravoxStatus === 'speaking') 
                        ? "bg-indigo-500 animate-pulse" 
                        : "bg-gray-300"
                    }`}
                    style={{
                      width: i === 3 ? "6px" : i === 2 || i === 4 ? "5px" : "3px",
                      height: i === 3 ? "24px" : i === 2 || i === 4 ? "18px" : i === 1 || i === 5 ? "12px" : "8px",
                      animationDelay: `${i * 100}ms`,
                      animationDuration: isUserSpeaking ? "0.6s" : "0.8s",
                    }}
                  />
                ))}
              </div>
              <div className="text-center mt-2">
                <div className="text-xs text-gray-600">
                  {isUserSpeaking ? 'Tú estás hablando...' :
                   ultravoxStatus === 'speaking' ? 'Lucía está hablando...' :
                   ultravoxStatus === 'listening' ? 'Escuchando...' : 
                   ultravoxStatus === 'thinking' ? 'Procesando...' :
                   ultravoxStatus === 'connecting' ? 'Conectando...' :
                   'Listo para conversar'}
                </div>
              </div>
            </div>

            {/* Chat container */}
            <div className="absolute top-[160px] sm:top-[189px] left-3 right-3 sm:left-4 sm:right-4 md:left-[37px] md:right-[37px] h-[240px] sm:h-[281px]">
              <div 
                ref={chatContainerRef}
                className="relative bg-gray-100 border border-gray-300 rounded-[13px] w-full h-full p-3 sm:p-4 overflow-y-auto"
              >
                {processedTranscripts.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <div className="text-sm">Inicia la conversación para ver las transcripciones</div>
                  </div>
                ) : (
                  processedTranscripts.map((transcript, index) => {
                    const formattedText = formatTextWithLineBreaks(transcript.text)
                    const endsWithTerminator = /[.!?…]$/.test(transcript.text.trim())
                    
                    return (
                      <div key={`${transcript.speaker}-${index}`} className="mb-4">
                        {transcript.speaker === 'user' ? (
                          <div className="flex items-start gap-2 mb-2">
                            <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                              <span className="text-[10px] font-medium text-white">TU</span>
                            </div>
                            <div className="text-xs font-medium text-slate-600">Tú:</div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2 justify-end mb-2">
                            <div className="text-xs font-medium text-slate-600">Lucía:</div>
                            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-[10px] font-medium text-white">L</span>
                            </div>
                          </div>
                        )}

                        <div
                          className={`bg-white rounded-2xl p-4 shadow-sm ${
                            transcript.speaker === 'user'
                              ? 'rounded-tl-none'
                              : 'rounded-tr-none text-right'
                          }`}
                        >
                          <div
                            className={`text-sm text-slate-700 leading-6 whitespace-pre-line ${
                              !transcript.isFinal ? 'italic text-gray-500' : ''
                            }`}
                          >
                            {formattedText}
                            {!transcript.isFinal && !endsWithTerminator && (
                              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}

                {isUserSpeaking && (
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">TU</span>
                    </div>
                    <div className="text-xs font-medium text-slate-600">Tú:</div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="absolute bottom-[30px] sm:bottom-[37px] left-3 right-3 sm:left-4 sm:right-4 md:left-[37px] md:right-[37px]">
              {!isCallActive ? (
                <button
                  onClick={handleStartConversation}
                  disabled={isLoading || isCooldown}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-7 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {isCooldown ? "Espera un momento" :
                     isLoading ? "Conectando..." :
                     "Iniciar una nueva conversación"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleStopConversation}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 sm:py-3 px-5 sm:px-7 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">
                    {isStopping ? "Terminando..." : "Terminar la conversación"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal de Rate Limit */}
        {showRateLimitModal && (
          <CallLimitModal
            isOpen
            onClose={handleCloseModal}
            resetDate={callRateLimit.resetDate}
            callCount={callRateLimit.callCount}
            callLimit={callRateLimit.callLimit}
          />
        )}
      </>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes pulse-glow {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.3);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }
        
        .btn-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        
        .btn-pulse-glow:disabled {
          animation: none;
        }
        
        .btn-pulse-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0.8),
            rgba(255, 255, 255, 0.4),
            rgba(255, 255, 255, 0.8)
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
      `}</style>
      
      {/* Modal de Rate Limit */}
      {showRateLimitModal && (
        <CallLimitModal
          isOpen
          onClose={handleCloseModal}
          resetDate={callRateLimit.resetDate}
          callCount={callRateLimit.callCount}
          callLimit={callRateLimit.callLimit}
        />
      )}
      
      {/* Cuadro de diálogo con texto animado */}
      <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 translate-x-2 sm:translate-x-4 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute left-2 top-0 transform -translate-y-3">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[16px] border-b-white"></div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-2 sm:py-3 shadow-lg border border-gray-200 max-w-[240px] sm:max-w-[280px] md:max-w-[320px] w-full">
            <div className="text-left">
              <p className="text-gray-600 text-xs font-medium mb-1">Cuál es tu consulta...</p>
              <p className="text-[#513ace] font-bold text-sm sm:text-base flex items-start min-h-[20px] sm:min-h-[24px]">
                {displayText}
                <span className="animate-pulse ml-1 text-[#513ace]">|</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón principal con animación de pulso y brillo */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={handleStartConversation}
          className="relative h-12 sm:h-14 md:h-16 px-4 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 text-base sm:text-lg md:text-xl bg-[#211661] rounded-[30px] sm:rounded-[40px] md:rounded-[50px] shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] flex justify-center items-center gap-2 sm:gap-3 md:gap-4 hover:bg-indigo-800 transition-colors whitespace-nowrap min-w-[200px] sm:min-w-[240px] md:min-w-[280px] lg:min-w-[320px] disabled:opacity-50 disabled:cursor-not-allowed btn-pulse-glow"
          disabled={isLoading || !isUltravoxReady || isLoadingModel || !activeModel || isAudioPlaying}
        >
          <Mic size={18} className="text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
          <span className="text-center text-white text-sm sm:text-base md:text-lg lg:text-xl font-semibold whitespace-nowrap">
            {!isUltravoxReady ? "Cargando..." : 
             isLoadingModel ? "Cargando modelo..." :
             !activeModel ? "Cargando modelo..." :
             t("hero.button")}
          </span>
        </button>
      </div>
    </>
  )
}

export default ChatInterface