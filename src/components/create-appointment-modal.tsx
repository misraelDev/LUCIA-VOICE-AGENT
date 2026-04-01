"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarDays, MapPin, Save, Loader2, X, Phone, FileText, AlignLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { toast } from "sonner"
import { appointmentService } from "@/services/AppointmentService"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Esquema de validación para el formulario
const appointmentFormSchema = z.object({
  summary: z.string().min(1, "El título es obligatorio"),
  description: z.string().optional(),
  location: z.string().optional(),
  date: z.string().min(1, "La fecha es obligatoria"),
  start_time: z.string().min(1, "La hora de inicio es obligatoria"),
  contact_phone: z.number().optional(),
  estado: z.enum(["confirmada", "reservada", "sin asignar", "cancelada"]),
})

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

interface CreateAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentCreated: () => void
}

export function CreateAppointmentModal({ isOpen, onClose, onAppointmentCreated }: CreateAppointmentModalProps) {
  const [creating, setCreating] = useState(false)

  // Valores predeterminados para el formulario
  const now = new Date()
  const defaultValues: AppointmentFormValues = {
    summary: "",
    description: "",
    location: "",
    date: now.toISOString().split('T')[0], // Solo la fecha YYYY-MM-DD
    start_time: now.toTimeString().slice(0, 5), // Solo la hora HH:mm
    contact_phone: undefined,
    estado: "sin asignar"
  }

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    mode: "onChange",
    defaultValues,
  })

  // Función para limpiar el formulario
  const resetForm = () => {
    form.reset(defaultValues)
  }

  // Manejar el cierre del modal
  const handleClose = () => {
    resetForm()
    onClose()
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()

    // Validar el formulario antes de enviar
    const isValid = await form.trigger()
    if (!isValid) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setCreating(true)
    try {
      const formData = form.getValues()
      
      // Crear objeto Date para validación
      const startDateTime = new Date(`${formData.date}T${formData.start_time}`)

      // Validar la fecha
      if (isNaN(startDateTime.getTime())) {
        throw new Error("La fecha ingresada no es válida")
      }

      // Set end_time to be the same as start_time since we're not using it anymore
      const endDateTime = new Date(startDateTime)

      await appointmentService.createAppointment({
        summary: formData.summary,
        description: formData.description,
        location: formData.location,
        // Backend espera LocalTime, enviar en formato HH:mm:ss
        startTime: `${formData.start_time.length === 5 ? formData.start_time : formData.start_time.slice(0,5)}:00`,
        endTime: `${formData.start_time.length === 5 ? formData.start_time : formData.start_time.slice(0,5)}:00`,
        date: formData.date,
        status: formData.estado,
        contactPhone: formData.contact_phone ? formData.contact_phone.toString() : undefined
      })

      toast.success("Cita registrada exitosamente ✅", {
        description: "La cita ha sido registrada correctamente.",
      })

      // Esperamos a que el toast se muestre y la cita se guarde
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Limpiamos el formulario, notificamos y cerramos
      resetForm()
      onAppointmentCreated()
      onClose()
    } catch (error) {
      console.error("Error al crear cita:", error)
      toast.error("Error al crear la cita ❌", {
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
      })
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={handleClose} aria-hidden="true" />

      {/* Modal Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col ${poppins.className}`}
      >
        {/* Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">Nueva cita</h2>
            <div className="text-sm text-[#303030]">
              <p>Complete el formulario para registrar</p>
              <p>una nueva cita</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Form {...form}>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <FormField
                control={form.control}
                name="summary"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={FileText}
                        label="Título"
                        placeholder="Título de la cita"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={MapPin}
                        label="Lugar"
                        placeholder="Ubicación"
                        disabled={creating}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={CalendarDays}
                        label="Fecha de la cita"
                        type="date"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_time"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={CalendarDays}
                        label="Hora de la cita"
                        type="time"
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_phone"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Phone}
                        label="Teléfono de contacto"
                        type="tel"
                        placeholder="Teléfono de contacto"
                        disabled={creating}
                        value={field.value != null ? String(field.value) : ""}
                        onChange={(v) => {
                          const digits = v.replace(/\D/g, "")
                          field.onChange(
                            digits ? Number.parseInt(digits, 10) : undefined,
                          )
                        }}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={CalendarDays}
                        label="Estado"
                        options={[
                          { value: "sin asignar", label: "Sin asignar" },
                          { value: "confirmada", label: "Confirmada" },
                          { value: "reservada", label: "Reservada" },
                          { value: "cancelada", label: "Cancelada" },
                        ]}
                        disabled={creating}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={AlignLeft}
                        label="Descripción"
                        multiline
                        rows={3}
                        placeholder="Descripción de la cita"
                        disabled={creating}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        error={fieldState.error?.message}
                        className={AUTH_INPUT_FIELD_CLASS}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-[#1868db] text-[#1868db] bg-[#f8f7fc] focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1868db] hover:text-white transition-all duration-200 group shadow-[0px_1px_3px_rgba(166,_175,_195,_0.4)]"
            >
              <X className="h-4 w-4 mr-2 text-[#1868db] group-hover:text-white transition-colors" />
              Cancelar
            </Button>
            <Button
              onClick={handleCreateEvent}
              className="flex-1 bg-[#1868db] text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-[#1458c4] hover:text-white transition-all duration-200"
              disabled={creating}
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear cita
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 