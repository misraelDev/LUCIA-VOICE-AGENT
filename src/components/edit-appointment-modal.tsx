"use client"

import { useState, useEffect, useCallback } from "react"
import { X, MapPin, Calendar, Clock, Save, Loader2, Phone, FileText, AlignLeft, ArrowLeft } from "lucide-react"
import { IconEdit } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { getAppointmentById, updateAppointment, type Appointment } from "@/services/AppointmentService"
import { Poppins } from "next/font/google"
import {
  translateAppointmentStatus,
  getStatusColor,
  cn,
} from "@/lib/utils"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const STATUS_OPTIONS = [
  "UNASSIGNED",
  "CONFIRMED",
  "RESERVED",
  "CANCELLED",
] as const

type AppointmentStatusUi = (typeof STATUS_OPTIONS)[number]

function normalizeStatus(raw: string | undefined): AppointmentStatusUi {
  const u = String(raw ?? "UNASSIGNED").toUpperCase()
  return STATUS_OPTIONS.includes(u as AppointmentStatusUi)
    ? (u as AppointmentStatusUi)
    : "UNASSIGNED"
}

function timeForInput(t: string | undefined): string {
  if (!t) return ""
  return t.length > 5 ? t.slice(0, 5) : t
}

interface EditAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId: number | null
  onAppointmentUpdated: () => void
}

export function EditAppointmentModal({ isOpen, onClose, appointmentId, onAppointmentUpdated }: EditAppointmentModalProps) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Estados para edición
  const [editData, setEditData] = useState({
    summary: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    date: "",
    status: "UNASSIGNED" as AppointmentStatusUi,
    contactPhone: ""
  })

  const fetchAppointment = useCallback(async () => {
    if (!appointmentId) return

    setLoading(true)
    try {
      const response = await getAppointmentById(appointmentId)
      if (response.success && response.appointment) {
        const data = response.appointment
        setAppointment(data)
        setEditData({
          summary: data.summary || "",
          description: data.description || "",
          location: data.location || "",
          startTime: data.startTime || "",
          endTime: data.endTime || "",
          date: data.date || new Date().toISOString().split('T')[0],
          status: normalizeStatus(data.status),
          contactPhone: data.contactPhone || ""
        })
      } else {
        throw new Error(response.error || "No se pudo obtener la cita")
      }
    } catch (error) {
      console.error("Error al cargar la cita:", error)
      toast.error("Error al cargar la cita", {
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado"
      })
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchAppointment()
    }
  }, [isOpen, appointmentId, fetchAppointment])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (appointment) {
      setEditData({
        summary: appointment.summary || "",
        description: appointment.description || "",
        location: appointment.location || "",
        startTime: appointment.startTime || "",
        endTime: appointment.endTime || "",
        date: appointment.date || new Date().toISOString().split('T')[0],
        status: normalizeStatus(appointment.status),
        contactPhone: appointment.contactPhone || ""
      })
    }
  }

  const handleSave = async () => {
    if (!appointmentId) return

    setSaving(true)
    try {
      await updateAppointment(appointmentId, {
        summary: editData.summary,
        description: editData.description,
        location: editData.location,
        startTime: editData.startTime,
        endTime: editData.endTime,
        date: editData.date,
        status: editData.status,
        contactPhone: editData.contactPhone
      })

      toast.success("Cita actualizada exitosamente")
      setIsEditing(false)
      onAppointmentUpdated()
      fetchAppointment()
    } catch (error) {
      console.error("Error al actualizar la cita:", error)
      toast.error("Error al actualizar la cita")
    } finally {
      setSaving(false)
    }
  }



  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />

      {/* Modal Panel */}
      <div className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col ${poppins.className}`}>
        {/* Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">Detalles de la cita</h2>
            <div className="text-sm text-[#303030]">
              <p>Información detallada de la cita</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : appointment ? (
            <div className="space-y-4">
              <InputWithIcon
                icon={FileText}
                label="Título"
                readOnly={!isEditing}
                value={
                  isEditing
                    ? editData.summary
                    : (appointment.summary ?? "")
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, summary: v })
                }
                placeholder="Título de la cita"
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
              <InputWithIcon
                icon={MapPin}
                label="Lugar"
                readOnly={!isEditing}
                value={
                  isEditing
                    ? editData.location
                    : (appointment.location ?? "")
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, location: v })
                }
                placeholder="Ubicación"
                hint={
                  !isEditing && !appointment.location?.trim()
                    ? "Sin ubicación"
                    : undefined
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
              <InputWithIcon
                icon={Calendar}
                label="Fecha de la cita"
                type="date"
                readOnly={!isEditing}
                value={
                  isEditing
                    ? editData.date
                    : (appointment.date?.slice(0, 10) ?? "")
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, date: v })
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
              <InputWithIcon
                icon={Clock}
                label="Hora de la cita"
                type="time"
                readOnly={!isEditing}
                value={
                  isEditing
                    ? timeForInput(editData.startTime)
                    : timeForInput(appointment.startTime)
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, startTime: v })
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
              <InputWithIcon
                icon={Phone}
                label="Teléfono de contacto"
                type="tel"
                readOnly={!isEditing}
                value={
                  isEditing
                    ? editData.contactPhone
                    : (appointment.contactPhone ?? "")
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, contactPhone: v })
                }
                placeholder="Teléfono de contacto"
                hint={
                  !isEditing && !appointment.contactPhone?.trim()
                    ? "Sin teléfono"
                    : undefined
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
              <InputWithIcon
                icon={Calendar}
                label="Estado"
                disabled={!isEditing}
                options={[
                  {
                    value: "UNASSIGNED",
                    label: translateAppointmentStatus("UNASSIGNED"),
                  },
                  {
                    value: "CONFIRMED",
                    label: translateAppointmentStatus("CONFIRMED"),
                  },
                  {
                    value: "RESERVED",
                    label: translateAppointmentStatus("RESERVED"),
                  },
                  {
                    value: "CANCELLED",
                    label: translateAppointmentStatus("CANCELLED"),
                  },
                ]}
                value={
                  isEditing
                    ? editData.status
                    : normalizeStatus(appointment.status)
                }
                onChange={(v) =>
                  isEditing &&
                  setEditData({
                    ...editData,
                    status: normalizeStatus(v),
                  })
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing &&
                    cn("cursor-default bg-muted/30", getStatusColor(appointment.status)),
                )}
              />
              <InputWithIcon
                icon={AlignLeft}
                label="Descripción"
                multiline
                rows={3}
                readOnly={!isEditing}
                value={
                  isEditing
                    ? editData.description
                    : (appointment.description ?? "")
                }
                onChange={(v) =>
                  isEditing && setEditData({ ...editData, description: v })
                }
                placeholder="Descripción de la cita"
                hint={
                  !isEditing && !appointment.description?.trim()
                    ? "Sin descripción"
                    : undefined
                }
                className={cn(
                  AUTH_INPUT_FIELD_CLASS,
                  !isEditing && "cursor-default bg-muted/30",
                )}
              />
            </div>
          ) : (
            <div className="text-center text-[#303030]">Cita no encontrada</div>
          )}
        </div>

        {/* Footer con botones */}
        {appointment && (
          <div className="border-t border-gray-200 p-4 bg-white">
            {isEditing ? (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex-1 border-[#1868db] text-[#1868db] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1868db] hover:text-white transition-all duration-200 group"
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2 text-[#1868db] group-hover:text-white transition-colors" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-[#1868db] text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1458c4] hover:text-white transition-all duration-200"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar cambios
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  className="flex-1 border-[#1868db] text-[#1868db] hover:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1868db] transition-all duration-200 group"
                >
                  <ArrowLeft className="h-4 w-4 mr-2 text-[#1868db] group-hover:text-white transition-colors" />
                  Regresar
                </Button>
                <Button 
                  type="button"
                  onClick={handleEdit} 
                  className="flex-1 bg-[#1868db] text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1458c4] hover:text-white transition-all duration-200 inline-flex items-center justify-center"
                >
                  <IconEdit className="size-4 mr-2 shrink-0" />
                  Editar cita
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

    </>
  )
}
