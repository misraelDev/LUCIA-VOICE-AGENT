"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { es } from "date-fns/locale/es"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { getAllAppointments, getAppointmentById, subscribeToAppointmentEvents, disconnectWebSocket, type Appointment } from "@/services/AppointmentService"
import { CreateAppointmentModal } from "@/components/create-appointment-modal"
import { EditAppointmentModal } from "@/components/edit-appointment-modal"
import Image from "next/image"
import type { Event } from "react-big-calendar"
import { PageHeaderActions } from "@/components/page-header"
import { SkeletonBar } from "@/components/data-table-skeleton"

type CalendarEvent = Event & {
  colorId?: string
  desc?: string
  location?: string
  estado?: string
}

const calendarStyles = `
  .rbc-event {
    border-radius: 4px;
    padding: 2px 5px;
    font-size: 0.85em;
    border: none;
  }
  
  .rbc-event.rbc-selected {
    box-shadow: none !important;
    opacity: 1 !important;
  }
  
  .rbc-event:focus {
    outline: none;
  }
  
  .rbc-event.rbc-selected:focus {
    outline: none;
  }
  
  .rbc-event.rbc-selected:hover {
    opacity: 1 !important;
  }
  
  .rbc-event.rbc-selected:active {
    opacity: 1 !important;
  }

  /* Override any default react-big-calendar styles */
  .rbc-event.rbc-selected,
  .rbc-event.rbc-selected:hover,
  .rbc-event.rbc-selected:active,
  .rbc-event.rbc-selected:focus {
    opacity: 1 !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  .rbc-allday-cell {
    display: none !important;
  }
  
  .rbc-time-header-content .rbc-header {
    border-bottom: none !important;
  }
  
  .bg-blue-100 { background-color: #dbeafe; }
  .bg-green-100 { background-color: #dcfce7; }
  .bg-purple-100 { background-color: #f3e8ff; }
  .bg-red-100 { background-color: #fee2e2; }
  .bg-yellow-100 { background-color: #fef9c3; }
  .bg-orange-100 { background-color: #ffedd5; }
  .bg-cyan-100 { background-color: #cffafe; }
  .bg-gray-100 { background-color: #f3f4f6; }
  .bg-sky-100 { background-color: #e0f2fe; }
  .bg-emerald-100 { background-color: #d1fae5; }
  .bg-rose-100 { background-color: #ffe4e6; }
  
  .text-blue-800 { color: #1e40af; }
  .text-green-800 { color: #166534; }
  .text-purple-800 { color: #6b21a8; }
  .text-red-800 { color: #991b1b; }
  .text-yellow-800 { color: #854d0e; }
  .text-orange-800 { color: #9a3412; }
  .text-cyan-800 { color: #155e75; }
  .text-gray-800 { color: #1f2937; }
  .text-sky-800 { color: #075985; }
  .text-emerald-800 { color: #065f46; }
  .text-rose-800 { color: #9f1239; }
  
  .rbc-day-bg {
    background: white !important;
  }
  
  .rbc-off-range-bg {
    background: #f9fafb !important;
  }
  
  .rbc-today {
    background-color: #f0f9ff !important;
  }
  
  .rbc-month-view, 
  .rbc-time-view,
  .rbc-agenda-view,
  .rbc-time-content,
  .rbc-month-row,
  .rbc-day-bg,
  .rbc-day-slot,
  .rbc-time-column,
  .rbc-header,
  .rbc-header + .rbc-header,
  .rbc-day-bg + .rbc-day-bg,
  .rbc-month-row + .rbc-month-row,
  .rbc-time-header-content,
  .rbc-time-header-content .rbc-row {
    border-color: #e5e7eb !important;
  }
  
  .rbc-time-view {
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
  }
  
  .rbc-time-header {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .rbc-time-header-content {
    border-left: 1px solid #e5e7eb;
  }
  
  .rbc-time-header-cell {
    padding: 8px;
  }
  
  .rbc-header {
    font-weight: 600;
    padding: 10px 3px;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  
  .rbc-header + .rbc-header {
    border-left: 1px solid #e5e7eb;
  }
  
  .rbc-day-slot .rbc-event {
    border-radius: 6px;
    padding: 4px 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  
  .rbc-day-slot .rbc-event-content {
    font-size: 0.9rem;
    line-height: 1.4;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  
  .rbc-time-slot {
    border-top: 1px solid #f3f4f6;
  }
  
  .rbc-timeslot-group {
    border-bottom: 1px solid #e5e7eb;
  }
  
  .rbc-label {
    font-size: 0.8rem;
    padding: 5px 5px 5px 10px;
    font-weight: 500;
  }
  
  .rbc-toolbar {
    margin-bottom: 16px;
    padding: 8px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  
  .rbc-toolbar button {
    color: #4b5563 !important;
    border: 1px solid #e5e7eb !important;
    padding: 6px 12px !important;
    border-radius: 6px !important;
    background-color: white !important;
    font-size: 0.875rem !important;
    transition: all 0.2s !important;
    outline: none !important;
  }
  
  .rbc-toolbar button:hover {
    background-color: #f9fafb !important;
    border-color: #d1d5db !important;
  }
  
  .rbc-toolbar button.rbc-active,
  .rbc-toolbar button:active {
    background-color: #1868db !important;
    border-color: #1868db !important;
    font-weight: 600 !important;
    color: white !important;
  }
  
  .rbc-toolbar button:focus {
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(0, 114, 255, 0.2) !important;
  }

  /* Botones separados (evita que Mes anterior / Mes / Día queden pegados) */
  .rbc-btn-group {
    display: inline-flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 0.5rem !important;
  }

  .rbc-btn-group > button {
    margin: 0 !important;
    flex: 0 0 auto !important;
  }
  
  .rbc-toolbar-label {
    font-weight: 600;
    font-size: 1.1rem;
    text-transform: capitalize;
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
    margin: 0 0.25rem !important;
    text-align: center !important;
  }
  
  @media (max-width: 640px) {
    .rbc-toolbar {
      flex-direction: column;
      align-items: stretch;
    }
    
    .rbc-toolbar-label {
      text-align: center;
      margin: 8px 0;
    }
    
    .rbc-btn-group {
      display: flex;
      justify-content: center;
    }
    
    .rbc-btn-group button {
      flex: 1;
    }
    
    .rbc-time-header-content .rbc-header.rbc-today {
      background-color: #f3f4f6;
    }
  }
`

const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const COLORS = {
  "1": { name: "Azul", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", hex: "#4285F4" },
  "2": { name: "Verde", bg: "bg-green-100", text: "text-green-800", border: "border-green-200", hex: "#0F9D58" },
  "3": { name: "Morado", bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", hex: "#8E24AA" },
  "4": { name: "Rojo", bg: "bg-red-100", text: "text-red-800", border: "border-red-200", hex: "#DB4437" },
  "5": { name: "Amarillo", bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200", hex: "#F4B400" },
  "6": { name: "Naranja", bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", hex: "#FF7043" },
  "7": { name: "Turquesa", bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-200", hex: "#00ACC1" },
  "8": { name: "Gris", bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", hex: "#9E9E9E" },
  "9": { name: "Azul claro", bg: "bg-sky-100", text: "text-sky-800", border: "border-sky-200", hex: "#4FC3F7" },
  "10": {
    name: "Verde claro",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
    hex: "#8BC34A",
  },
  "11": { name: "Rojo claro", bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-200", hex: "#EF9A9A" },
}

const STATUS_COLORS = {
  "reserved": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", hex: "#4285F4" },
  "confirmed": { bg: "bg-green-100", text: "text-green-800", border: "border-green-200", hex: "#0F9D58" },
  "cancelled": { bg: "bg-red-100", text: "text-red-800", border: "border-red-200", hex: "#DB4437" },
  "unassigned": { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200", hex: "#9E9E9E" },
}

export default function AppointmentsPage() {
  const [events, setEvents] = useState<Appointment[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [date, setDate] = useState(new Date())
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const styleElement = document.createElement("style")
    styleElement.innerHTML = calendarStyles
    document.head.appendChild(styleElement)

    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await getAllAppointments()
      if (response.success && response.appointments) {
        setEvents(response.appointments)
      } else {
        throw new Error(response.error || "Error al cargar las citas")
      }
    } catch (err) {
      console.error("Error al cargar eventos:", err)
      setError(err instanceof Error ? err.message : "Error al cargar los eventos del calendario")
      toast.error("Error al cargar los eventos", {
        description: err instanceof Error ? err.message : "Ocurrió un error inesperado",
      })
    } finally {
      setIsInitialLoad(false)
    }
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const shouldRefresh = searchParams.get("refresh") === "true"

    if (shouldRefresh) {
      fetchEvents()
      window.history.replaceState({}, "", "/dashboard/appointments")
    } else {
      fetchEvents()
    }

    // Suscribirse a eventos WebSocket
    const unsubscribeCreated = subscribeToAppointmentEvents('appointmentCreated', () => {
      fetchEvents() // Actualizar cuando se crea una cita
    })
    
    const unsubscribeUpdated = subscribeToAppointmentEvents('appointmentUpdated', () => {
      fetchEvents() // Actualizar cuando se actualiza una cita
    })
    
    const unsubscribeCancelled = subscribeToAppointmentEvents('appointmentCancelled', () => {
      fetchEvents() // Actualizar cuando se cancela una cita
    })
    
    const unsubscribeStatusChanged = subscribeToAppointmentEvents('appointmentStatusChanged', () => {
      fetchEvents() // Actualizar cuando cambia el estado
    })

    return () => {
      unsubscribeCreated()
      unsubscribeUpdated()
      unsubscribeCancelled()
      unsubscribeStatusChanged()
      disconnectWebSocket()
    }
  }, [pathname])

  const CustomToolbar = () => {
    const isCurrentMonth = () => {
      const today = new Date()
      return date.getMonth() === today.getMonth() && 
             date.getFullYear() === today.getFullYear()
    }

    const goToBack = () => {
      const newDate = new Date(date)
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() - 1)
      }
      setDate(newDate)
    }

    const goToNext = () => {
      const newDate = new Date(date)
      if (view === "month") {
        newDate.setMonth(newDate.getMonth() + 1)
      } else if (view === "week") {
        newDate.setDate(newDate.getDate() + 7)
      } else {
        newDate.setDate(newDate.getDate() + 1)
      }
      setDate(newDate)
    }

    const goToCurrent = () => {
      setDate(new Date())
    }

    const handleViewChange = (newView: "month" | "week" | "day") => {
      setView(newView)
    }

    const label = () => {
      if (view === "month") {
        return format(date, "MMMM yyyy", { locale: es })
      } else if (view === "week") {
        const start = startOfWeek(date, { locale: es })
        const end = new Date(start)
        end.setDate(end.getDate() + 6)
        return `${format(start, "d", { locale: es })} - ${format(end, "d MMMM yyyy", { locale: es })}`
      } else {
        return format(date, "EEEE, d MMMM yyyy", { locale: es })
      }
    }

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button 
            type="button" 
            onClick={goToBack} 
            className="hover:bg-gray-100"
          >
            {view === "month" ? "Mes anterior" : view === "week" ? "Semana anterior" : "Día anterior"}
          </button>
          <button 
            type="button" 
            onClick={goToCurrent} 
            className={`hover:bg-gray-100 ${isCurrentMonth() ? 'rbc-active' : ''}`}
          >
            {view === "month" ? "Mes actual" : view === "week" ? "Semana actual" : "Día actual"}
          </button>
          <button 
            type="button" 
            onClick={goToNext} 
            className="hover:bg-gray-100"
          >
            {view === "month" ? "Mes siguiente" : view === "week" ? "Semana siguiente" : "Día siguiente"}
          </button>
        </span>
        <span className="rbc-toolbar-label">{label()}</span>
        <span className="rbc-btn-group">
          <button
            type="button"
            className={view === "month" ? "rbc-active" : ""}
            onClick={() => handleViewChange("month")}
          >
            Mes
          </button>
          <button
            type="button"
            className={view === "week" ? "rbc-active" : ""}
            onClick={() => handleViewChange("week")}
          >
            Semana
          </button>
          <button 
            type="button" 
            className={view === "day" ? "rbc-active" : ""} 
            onClick={() => handleViewChange("day")}
          >
            Día
          </button>
        </span>
      </div>
    )
  }

  const EventComponent = ({ event }: { event: Event }) => {
    const e = event as CalendarEvent
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="font-medium">{e.title}</div>
        {e.location && view !== "month" && (
          <div className="text-xs mt-1 opacity-80 truncate">📍 {e.location}</div>
        )}
        {e.desc && view !== "month" && <div className="text-xs mt-1 opacity-80 line-clamp-2">{e.desc}</div>}
      </div>
    )
  }

  const handleEventSelect = async (event: Event) => {
    const id = Number((event as Event).id)
    if (Number.isNaN(id)) return
    
    try {
      const response = await getAppointmentById(id)
      if (response.success && response.appointment) {
        setSelectedAppointmentId(id)
        setIsModalOpen(true)
      } else {
        toast.error("Error al cargar la cita", {
          description: response.error || "No se pudo obtener los detalles de la cita"
        })
      }
    } catch (err) {
      console.error("Error al obtener detalles de la cita:", err)
      toast.error("Error al cargar la cita", {
        description: "Ocurrió un error inesperado al obtener los detalles"
      })
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedAppointmentId(null)
  }

  const handleAppointmentUpdated = () => {
    fetchEvents()
  }

  const handleCreateClick = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false)
  }

  const handleAppointmentCreated = () => {
    fetchEvents()
  }

  return (
    <>
      <PageHeaderActions>
        <Button
          onClick={handleCreateClick}
          className="rounded-md bg-[#1868db] hover:bg-[#1458c4] flex flex-row items-center justify-center py-2.5 px-4 gap-2.5 text-white"
        >
          <div className="w-5 relative h-5 shrink-0 overflow-hidden flex items-center justify-center">
            <Image
              className="w-full h-full overflow-hidden shrink-0 object-cover absolute left-[0px] top-[0px] [transform:scale(1)] brightness-0 invert"
              fill
              alt="Add appointment icon"
              src="/guardar.svg"
            />
          </div>
          <div className="relative leading-6 font-medium text-white">Nueva cita</div>
        </Button>
      </PageHeaderActions>
            <div className="flex flex-col gap-6 p-6">
              <div className="w-full">
                {isInitialLoad ? (
                  <div className="space-y-4" aria-busy aria-label="Cargando calendario">
                    <span className="sr-only">Cargando citas y calendario</span>
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <SkeletonBar className="h-4 w-4 shrink-0 rounded-sm" />
                          <SkeletonBar className="h-4 w-36 max-w-[40vw]" />
                        </div>
                      ))}
                    </div>
                    <SkeletonBar className="h-[600px] w-full rounded-lg" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center space-y-6 rounded-xl bg-gray-50 py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">No se pudieron cargar los eventos</p>
                      <p className="text-sm ">{error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-row items-center justify-center gap-[25px] text-left text-sm text-darkslategray">
                      <div className="flex flex-row items-center justify-start gap-[7px]">
                        <div className="w-[15px] relative rounded-sm bg-[#4285F4] h-[15px] [transform:_rotate(90deg)]" />
                        <div className="relative tracking-[-0.02em] font-semibold">Citas reservadas</div>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-[7px]">
                        <div className="w-[15px] relative rounded-sm bg-[#0F9D58] h-[15px] [transform:_rotate(90deg)]" />
                        <div className="relative tracking-[-0.02em] font-semibold">Citas confirmadas</div>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-[7px]">
                        <div className="w-[15px] relative rounded-sm bg-[#DB4437] h-[15px] [transform:_rotate(90deg)]" />
                        <div className="relative tracking-[-0.02em] font-semibold">Citas canceladas</div>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-[7px]">
                        <div className="w-[15px] relative rounded-sm bg-[#9E9E9E] h-[15px] [transform:_rotate(90deg)]" />
                        <div className="relative tracking-[-0.02em] font-semibold">Citas sin asignar</div>
                      </div>
                    </div>
                    <div className={`bg-white rounded-lg ${view === "month" ? "h-[600px]" : "h-[700px]"}`}>
                      <Calendar
                        localizer={localizer}
                        events={events.map(
                          (event: Appointment): CalendarEvent => ({
                            id: event.id,
                            title: event.summary,
                            start: new Date(`${event.date}T${event.startTime}`),
                            end: new Date(`${event.date}T${event.endTime}`),
                            desc: event.description || undefined,
                            location: event.location || undefined,
                            colorId: event.colorId || undefined,
                            estado: event.status?.toLowerCase() || "unassigned",
                          }),
                        )}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: "100%" }}
                        culture="es"
                        view={view}
                        date={date}
                        onView={(newView) => setView(newView as "month" | "week" | "day")}
                        onNavigate={(newDate) => setDate(newDate)}
                        messages={{
                          next: "Siguiente",
                          previous: "Anterior",
                          today: "Hoy",
                          month: "Mes",
                          week: "Semana",
                          day: "Día",
                          agenda: "Agenda",
                          date: "Fecha",
                          time: "Hora",
                          event: "Evento",
                          noEventsInRange: "No hay eventos en este rango",
                          showMore: (total: number) => `+ Ver más (${total})`,
                        }}
                        eventPropGetter={(event: Event) => {
                          const e = event as CalendarEvent
                          const statusConfig = STATUS_COLORS[e.estado as keyof typeof STATUS_COLORS]
                          if (statusConfig) {
                            return {
                              className: `${statusConfig.bg}`,
                              style: {
                                borderLeft: `4px solid ${statusConfig.hex}`,
                                color: `var(--${statusConfig.text.replace("text-", "")})`,
                                boxShadow: view !== "month" ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                                padding: view !== "month" ? "6px 8px" : "2px 5px",
                                backgroundColor: statusConfig.hex + "20"
                              },
                            }
                          }

                          if (!e.colorId) return {}

                          const colorConfig = COLORS[e.colorId as keyof typeof COLORS]
                          if (!colorConfig) return {}

                          return {
                            className: `${colorConfig.bg}`,
                            style: {
                              borderLeft: `4px solid ${colorConfig.hex}`,
                              color: `var(--${colorConfig.text.replace("text-", "")})`,
                              boxShadow: view !== "month" ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                              padding: view !== "month" ? "6px 8px" : "2px 5px",
                              backgroundColor: colorConfig.hex + "20"
                            },
                          }
                        }}
                        onSelectEvent={handleEventSelect}
                        views={["month", "week", "day"]}
                        defaultView="month"
                        popup
                        selectable
                        onSelectSlot={() => {}}
                        components={{
                          toolbar: CustomToolbar,
                          event: EventComponent,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

        {/* Modal de detalles de cita */}
        <EditAppointmentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          appointmentId={selectedAppointmentId}
          onAppointmentUpdated={handleAppointmentUpdated}
        />

        {/* Modal de creación de cita */}
        <CreateAppointmentModal
          isOpen={isCreateModalOpen}
          onClose={handleCreateModalClose}
          onAppointmentCreated={handleAppointmentCreated}
        />
    </>
  )
}
