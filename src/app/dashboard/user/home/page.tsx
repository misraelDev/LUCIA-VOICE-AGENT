"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  useDashboardStatsWithWebSocket,
  type TopConversation,
  type FrequentMotive,
  type RecentContact,
} from "@/hooks/useStats"
import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, Info } from "lucide-react"
// Eliminado DashboardProvider obsoleto

import { CallsAppointmentsChart } from "@/components/calls-appointments-chart"
import { TourProvider, useTour } from "@reactour/tour"
import { Button } from "@/components/ui/button"

// Definición de los pasos del tour
const tourSteps = [
  {
    selector: "#tour-dashboard",
    content: "Aquí encontrarás las métricas principales sobre la interacción con tus clientes. Verás la evolución de tu negocio mes a mes.",
  },
  {
    selector: "#tour-call-history",
    content: "Visualiza el detalle de las llamadas que atendió Lucia. Podrás ver el día, hora, motivo de llamada e información del cliente.",
  },
  {
    selector: "#tour-conversations",
    content: "Podrás ver las conversaciones que Lucía ha tenido con tus clientes. Inclusive en tiempo real.",
  },
  {
    selector: "#tour-appointments",
    content: "Gestiona y revisa las citas que Lucia ya reservó para tus clientes. Podrás revisar el día y la hora, también si fue reprogramada o cancelada.",
  },
  {
    selector: "#tour-contacts",
    content: "Ahora podrás gestionar la información de tus clientes que Lucía irá recopilando en cada atención.",
  },
  {
    selector: "#tour-tickets",
    content: "Visualiza los escalamientos que Lucía realiza cuando no tiene la información necesaria. Aquí podrás ver cuál fue el motivo y quién está asignado a ese caso.",
  },
]

// Componente Popover personalizado para el tour
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTourPopover(props: any) {
  console.log('Props recibidos:', props) // Debug para ver qué props recibimos

  const {
    content,
    currentStep = 0,
    stepsLength = tourSteps.length,
    setCurrentStep,
    setIsOpen,
    steps = tourSteps
  } = props

  // Estado para controlar si estamos en modo video
  const [isVideoMode, setIsVideoMode] = React.useState(false)

  const stepTitles = [
    "Página Principal",
    "Historial de Llamadas",
    "Conversaciones",
    "Citas",
    "Contactos",
    "Tickets"
  ]

  // Videos locales para cada paso (null si no hay video disponible)
  const stepVideos = [
    "/videos/2.pagina principal.mp4",  // Dashboard
    "/videos/4.llamadas.mp4",          // Historial de Llamadas  
    "/videos/3.conversaciones.mp4",    // Conversaciones
    "/videos/5.citas.mp4",             // Citas
    null,                              // Contactos (sin video)
    null,                              // Tickets (sin video)
  ]

  // Verificar si el paso actual tiene video disponible
  const hasVideo = stepVideos[currentStep] !== null

  // Manejar cambios de paso cuando estamos en modo video
  React.useEffect(() => {
    // Si estamos en modo video pero el paso actual no tiene video, cambiar a modo texto
    if (isVideoMode && !hasVideo) {
      setIsVideoMode(false)
    }
  }, [currentStep, isVideoMode, hasVideo])

  // Debug: verificar elementos del DOM
  React.useEffect(() => {
    console.log('Tour Debug - Paso actual:', currentStep + 1, 'de', stepsLength)
    console.log('Content:', content)
    console.log('Steps:', steps)
    console.log('Elementos encontrados:')
    tourSteps.forEach((step, index) => {
      const element = document.querySelector(step.selector)
      console.log(`${index + 1}. ${step.selector}:`, element ? '✅ Encontrado' : '❌ No encontrado')
    })
  }, [currentStep, stepsLength, content, steps])

  // Obtener el contenido del paso actual
  const currentContent = content || (steps && steps[currentStep] ? steps[currentStep].content : tourSteps[currentStep]?.content)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        padding: '24px',
        maxWidth: '400px',
        minWidth: '350px',
        position: 'relative',
        zIndex: 10000,
      }}
    >
      {/* Header con título, paginación, ver video y avatar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'nowrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: '1', minWidth: 0 }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a1a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stepTitles[currentStep] || 'Paso del Tour'}
          </h3>
          <span style={{ fontSize: '10px', color: '#999', background: '#f5f5f5', padding: '2px 6px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
            {currentStep + 1}/{stepsLength}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {/* Solo mostrar botón "Ver video" si hay video disponible y no estamos en modo video */}
          {hasVideo && !isVideoMode && (
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                background: 'transparent',
                border: 'none',
                color: '#2B00FF',
                fontSize: '10px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '2px 4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                setIsVideoMode(true)
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Ver video
            </button>
          )}
          <span className="relative inline-block h-8 w-8 shrink-0 overflow-hidden rounded-full">
            <Image
              src="/avatar.png"
              alt="Avatar"
              fill
              className="object-cover"
              sizes="32px"
            />
          </span>
        </div>
      </div>

      {/* Contenido - Modo Texto o Video */}
      {isVideoMode && stepVideos[currentStep] ? (
        <div style={{ margin: '0 0 20px 0' }}>
          <video
            key={`video-${currentStep}`}
            width="100%"
            height="200"
            controls
            autoPlay
            style={{
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#000',
            }}
          >
            <source src={stepVideos[currentStep]!} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
            padding: '8px 0'
          }}>
            <span style={{ fontSize: '12px', color: '#666' }}>
              Video tutorial: {stepTitles[currentStep]}
            </span>
            <button
              onClick={() => setIsVideoMode(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2B00FF',
                fontSize: '11px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Volver al texto
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#666', margin: '0 0 20px 0' }}>
          {currentContent || 'Contenido del paso del tour'}
        </p>
      )}

      {/* Puntos de progreso */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
        {Array.from({ length: stepsLength }, (_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: index === currentStep ? '#2B00FF' : '#e0e0e0',
              cursor: 'pointer',
            }}
            onClick={() => setCurrentStep && setCurrentStep(index)}
          />
        ))}
      </div>

      {/* Botones de navegación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentStep && setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={{
            background: 'transparent',
            color: currentStep === 0 ? '#ccc' : '#666',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Anterior
        </button>

        <button
          onClick={() => {
            if (currentStep < stepsLength - 1) {
              const nextStep = currentStep + 1
              if (setCurrentStep) {
                setCurrentStep(nextStep)
              }
              
              // Si estamos en modo video y el siguiente paso también tiene video, mantener modo video
              // Si el siguiente paso no tiene video, cambiar a modo texto
              if (isVideoMode && stepVideos[nextStep] === null) {
                setIsVideoMode(false)
              } else if (isVideoMode && stepVideos[nextStep] !== null) {
                // Mantener modo video para el siguiente paso
                setIsVideoMode(true)
              }
            } else {
              if (setIsOpen) {
                setIsOpen(false)
              }
            }
          }}
          style={{
            background: '#2B00FF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}
        >
          {currentStep < stepsLength - 1 ? 'Siguiente' : 'Finalizar'}
        </button>
      </div>
    </div>
  )
}

// Componente principal del Dashboard
function DashboardHomePage() {
  return (
    <TourProvider
      steps={tourSteps}
      ContentComponent={CustomTourPopover}
      padding={{ mask: 10 }}
      styles={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        popover: (base: any) => ({
          ...base,
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          padding: 0,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        maskArea: (base: any) => ({ ...base, rx: 10 }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        maskWrapper: (base: any) => ({ ...base, color: 'rgba(0, 0, 0, 0.5)' }),
      }}
      showBadge={false}
      showCloseButton={false}
      showNavigation={false}
      showDots={false}
    >
      <DashboardContent />
    </TourProvider>
  )
}

// Contenido del Dashboard
function DashboardContent() {
  const [metrics, setMetrics] = useState([
    {
      title: "Llamadas entrantes",
      value: "0",
      subtitle: "total de llamadas",
      icon: () => <Image src="/rojo.svg" alt="Llamadas" width={72} height={72} />,
      color: "bg-red-50 text-red-600",
      trend: "up",
    },
    {
      title: "Contactos nuevos",
      value: "0",
      subtitle: "total de contactos",
      icon: () => <Image src="/azul.svg" alt="Contactos" width={72} height={72} />,
      color: "bg-blue-50 text-blue-600",
      trend: "up",
    },
    {
      title: "Citas programadas",
      value: "0",
      subtitle: "total de citas",
      icon: () => <Image src="/naranja.svg" alt="Citas" width={72} height={72} />,
      color: "bg-orange-50 text-orange-600",
      trend: "up",
    },
    {
      title: "Duración promedio",
      value: "00:00",
      subtitle: "tiempo promedio por llamada",
      icon: () => <Image src="/verde.svg" alt="Duración" width={72} height={72} />,
      color: "bg-green-50 text-green-600",
      trend: "up",
    },
  ])
  const [selectedTimeRange, setSelectedTimeRange] = useState<"1 año" | "3 meses" | "30 días" | "7 días">("1 año")
  const [conversations, setConversations] = useState<TopConversation[]>([])
  const [frequentMotives, setFrequentMotives] = useState<FrequentMotive[]>([])
  const [recentContacts, setRecentContacts] = useState<RecentContact[]>([])

  // Helper function to format duration
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60)
    const seconds = Math.floor(duration % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Usar React Query hook que incluye WebSocket
  const { data: stats } = useDashboardStatsWithWebSocket()

  // Actualizar estado cuando los datos cambien
  useEffect(() => {
    if (stats) {
      console.log("Dashboard stats received:", stats)

      // Actualizar métricas
      setMetrics((prevMetrics) => {
        const newMetrics = [...prevMetrics]
        newMetrics[0] = {
          ...newMetrics[0],
          value: stats.totalCalls?.toString() || '0',
        }
        newMetrics[1] = {
          ...newMetrics[1],
          value: stats.totalContacts?.toString() || '0',
        }
        newMetrics[2] = {
          ...newMetrics[2],
          value: stats.totalAppointments?.toString() || '0',
        }
        newMetrics[3] = {
          ...newMetrics[3],
          value: formatDuration(stats.averageCallDuration || 0),
        }
        return newMetrics
      })

      // Actualizar conversaciones, motivos y contactos
      setConversations(stats.topConversations || [])
      setFrequentMotives(stats.frequentMotives || [])
      setRecentContacts(stats.recentContacts || [])
    }
  }, [stats])

  // Helper function to format time ago
  const getTimeAgo = (date: string) => {
    const now = new Date()
    const conversationDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - conversationDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `hace ${Math.floor(diffInMinutes / 60)} horas`
    return `hace ${Math.floor(diffInMinutes / 1440)} días`
  }

  // Helper function to calculate percentage
  const calculatePercentage = (total: number) => {
    if (frequentMotives.length === 0) return "0%"
    const maxCalls = frequentMotives[0].total_calls
    const percentage = (total / maxCalls) * 100
    return `${percentage.toFixed(1)}%`
  }

  // Helper function to format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const { setIsOpen } = useTour()

  return (
    <>
              <div className="flex flex-col gap-6 p-6">
                {/* Botón para iniciar el tour */}
                <Button
                  onClick={() => setIsOpen(true)}
                  className="absolute top-4 right-4 z-50 flex items-center gap-2"
                  variant="outline"
                >
                  <Info className="h-4 w-4" />
                  Iniciar Tour
                </Button>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metrics.map((metric, index) => (
                    <Card key={index} className="shadow-sm py-0">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-16 h-16 rounded-md flex items-center justify-center ${metric.color}`}>
                            <metric.icon />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold tabular-nums">
                                {metric.value}
                              </span>
                              <TrendingUp className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">{metric.title}</p>
                              <p className="text-xs text-gray-500">{metric.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Section */}
                <div className="w-full">
                  <CallsAppointmentsChart
                    selectedTimeRange={selectedTimeRange}
                    onTimeRangeChange={setSelectedTimeRange}
                  />
                </div>

                {/* Bottom Section */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Conversations */}
                  <Card className="flex h-[380px] flex-col gap-0 overflow-hidden py-0">
                    <CardHeader className="shrink-0 border-b border-gray-100 !py-3">
                      <CardTitle className="text-base font-semibold leading-tight">
                        Conversaciones recientes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-0 px-6 pb-3 pt-3">
                      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain pr-1">
                        {conversations.map((conv, index) => (
                          <div key={index} className="flex items-center gap-3 rounded-lg bg-white p-3">
                            <Avatar className="w-11 h-11">
                              <AvatarFallback>
                                {conv.contact_name
                                  ? conv.contact_name.split(" ").map((n: string) => n[0]).join("")
                                  : "N/A"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{conv.contact_name}</span>
                                <span className="text-xs text-gray-500">• {getTimeAgo(conv.date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="truncate text-xs text-gray-600">{conv.motive}</p>
                                <span className="text-xs text-gray-500">({formatDuration(conv.duration)})</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/dashboard/user/call-history"
                        className="mt-3 block w-full shrink-0 text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Ver todos
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Motivos recientes */}
                  <Card className="flex h-[380px] flex-col gap-0 overflow-hidden py-0">
                    <CardHeader className="shrink-0 border-b border-gray-100 !py-3">
                      <CardTitle className="text-base font-semibold leading-tight">Motivos recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-0 px-6 pb-3 pt-3">
                      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain pr-1">
                        {frequentMotives.map((motive, index) => (
                          <div key={index} className="rounded-lg bg-white p-3">
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-sm font-medium">{motive.motive}</span>
                            </div>
                            <div className="h-1 w-full rounded-full bg-gray-200">
                              <div
                                className="h-1 rounded-full bg-green-500"
                                style={{ width: calculatePercentage(motive.total_calls) }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/dashboard/user/call-history"
                        className="mt-3 block w-full shrink-0 text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Ver todos
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Recent Clients */}
                  <Card className="flex h-[380px] flex-col gap-0 overflow-hidden py-0">
                    <CardHeader className="shrink-0 border-b border-gray-100 !py-3">
                      <CardTitle className="text-base font-semibold leading-tight">Clientes recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="flex min-h-0 flex-1 flex-col gap-0 px-6 pb-3 pt-3">
                      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain pr-1">
                        {recentContacts.map((contact, index) => (
                          <div key={index} className="flex items-center gap-3 rounded-lg bg-white p-3">
                            <Avatar className="w-11 h-11">
                              <AvatarFallback>
                                {contact.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="text-sm font-semibold">{contact.name}</div>
                              <span className="mt-1 block text-xs text-gray-500">
                                Registrado: {formatDate(contact.creation_date)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link
                        href="/dashboard/user/contacts"
                        className="mt-3 block w-full shrink-0 text-center text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Ver todos
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
    </>
  )
}

export default DashboardHomePage

