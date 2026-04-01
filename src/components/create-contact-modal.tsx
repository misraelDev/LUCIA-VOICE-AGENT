"use client"

import type { FormEvent } from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Loader2, Mail, Phone, User, X, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { toast } from "sonner"
import { createContact } from "@/services/ContactService"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

// Esquema de validación para el formulario de contacto
const contactFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  phone_number: z.string().min(1, "El teléfono es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
  categorias: z.enum(["sin categoria", "cliente", "prospecto", "proveedor"]).optional(),
})

// Tipo para los valores del formulario
type ContactFormValues = z.infer<typeof contactFormSchema>

// Tipo para los datos que se envían al servicio
type ContactServiceData = Omit<ContactFormValues, 'phone_number'> & {
  phone_number: number
}

interface CreateContactModalProps {
  isOpen: boolean
  onClose: () => void
  onContactCreated: () => void
}

export function CreateContactModal({ isOpen, onClose, onContactCreated }: CreateContactModalProps) {
  const [creating, setCreating] = useState(false)

  // Valores predeterminados para el formulario
  const defaultValues: Partial<ContactFormValues> = useMemo(() => ({
    email: "",
    phone_number: "",
    name: "",
    categorias: "sin categoria",
  }), [])

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues,
  })

  // Función para limpiar el formulario
  const resetForm = useCallback(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  // Manejar el cierre del modal
  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  async function handleCreateContact(e: FormEvent) {
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
      // Convertir los datos al formato esperado por el servicio
      const dataToSend: ContactServiceData = {
        ...formData,
        phone_number: Number(formData.phone_number.replace(/\D/g, ""))
      }

      // Usar el nuevo servicio
      const response = await createContact(dataToSend)
      if (!response.success || !response.data) {
        throw new Error(response.error || "No se pudo crear el contacto")
      }

      toast.success("Contacto registrado exitosamente ✅", {
        description: "El contacto ha sido registrado correctamente.",
      })

      // Esperamos a que el toast se muestre
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Limpiamos el formulario, notificamos y cerramos
      resetForm()
      onContactCreated()
      onClose()
    } catch (error) {
      console.error("Error al crear contacto:", error)
      toast.error("Error al crear el contacto ❌", {
        description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
      })
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, handleClose])

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
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">Nuevo contacto</h2>
            <div className="text-sm text-[#303030]">
              <p>Complete el formulario para registrar</p>
              <p>un nuevo contacto</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Form {...form}>
            <form onSubmit={handleCreateContact} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={User}
                        label="Nombre"
                        placeholder="Nombre completo"
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
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Mail}
                        label="Correo electrónico"
                        type="email"
                        placeholder="ejemplo@correo.com"
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
                name="phone_number"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Phone}
                        label="Teléfono"
                        type="tel"
                        placeholder="+1234567890"
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
                name="categorias"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={Tag}
                        label="Categorías"
                        options={[
                          { value: "sin categoria", label: "Sin categoría" },
                          { value: "cliente", label: "Cliente" },
                          { value: "prospecto", label: "Prospecto" },
                          { value: "proveedor", label: "Proveedor" },
                        ]}
                        disabled={creating}
                        value={field.value || "sin categoria"}
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
              onClick={handleCreateContact}
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
                  Crear contacto
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
