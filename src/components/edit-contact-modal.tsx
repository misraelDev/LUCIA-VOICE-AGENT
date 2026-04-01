"use client"

import type { FormEvent } from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Save, Loader2, Mail, Phone, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { toast } from "sonner"
import { updateContact, type Contact } from "@/services/ContactService"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const contactFormSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es obligatorio"),
  phone_number: z.string().min(1, "El teléfono es obligatorio"),
  name: z.string().min(1, "El nombre es obligatorio"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

interface EditContactModalProps {
  isOpen: boolean
  onClose: () => void
  contact: Contact | null
  onContactUpdated: () => void
}

export function EditContactModal({
  isOpen,
  onClose,
  contact,
  onContactUpdated,
}: EditContactModalProps) {
  const [saving, setSaving] = useState(false)

  const defaultValues: Partial<ContactFormValues> = useMemo(
    () => ({
      email: "",
      phone_number: "",
      name: "",
    }),
    [],
  )

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues,
  })

  useEffect(() => {
    if (isOpen && contact) {
      form.reset({
        name: contact.name ?? "",
        email: contact.email ?? "",
        phone_number:
          contact.phone_number != null ? String(contact.phone_number) : "",
      })
    }
  }, [isOpen, contact, form])

  const resetForm = useCallback(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  const handleClose = useCallback(() => {
    resetForm()
    onClose()
  }, [onClose, resetForm])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!contact) return

    const isValid = await form.trigger()
    if (!isValid) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setSaving(true)
    try {
      const formData = form.getValues()
      const digits = formData.phone_number.replace(/\D/g, "")
      const phoneNum = digits ? Number(digits) : null

      const response = await updateContact(contact.contact_id, {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone_number: phoneNum,
      })

      if (!response.success || !response.data) {
        throw new Error(response.error || "No se pudo actualizar el contacto")
      }

      toast.success("Contacto actualizado", {
        description: "Los cambios se guardaron correctamente.",
      })

      resetForm()
      onContactUpdated()
      onClose()
    } catch (error) {
      console.error("Error al actualizar contacto:", error)
      toast.error("Error al actualizar el contacto", {
        description:
          error instanceof Error ? error.message : "Ocurrió un error inesperado",
      })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const handleEscape = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") handleClose()
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

  if (!isOpen || !contact) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col ${poppins.className}`}
      >
        <div className="p-4 flex items-start justify-between">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-xl font-bold tracking-[-0.02em] text-[#303030]">
              Editar contacto
            </h2>
            <p className="text-sm text-[#303030]">
              Modifica los datos y guarda los cambios
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        disabled={saving}
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
                        disabled={saving}
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
                        disabled={saving}
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
            </form>
          </Form>
        </div>

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
              onClick={handleSubmit}
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
        </div>
      </div>
    </>
  )
}
