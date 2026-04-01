'use client'

import React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form"
import { Loader2, Mail, Phone, User, HelpCircle, Send, AlignLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { requestService, ContactFormData } from "@/services/RequestService"

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor ingresa un correo electrónico válido." }),
  phone: z.string().optional(),
  need: z.string().optional(),
  message: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres." }),
  // campo honeypot
  company: z.string().max(0).optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      need: "",
      message: "",
      company: "",
    },
  })

  async function onSubmit(values: ContactFormData) {
    // detener bots (honeypot)
    if (values.company) return
    setLoading(true)
    
    try {
      const result = await requestService.sendContactEmail(values)

      if (!result.success) {
        throw new Error(result.error || 'Error al enviar el mensaje')
      }

      setSubmitted(true)
      form.reset()
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Glow detrás */}
      <div className="pointer-events-none absolute -inset-3 -z-10 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 blur-xl" />
      {/* Borde en degradado */}
      <div className="bg-gradient-to-tr from-indigo-500/30 via-violet-500/30 to-fuchsia-500/30 p-[1px]">
        <Card className="border-slate-200 bg-white p-6 shadow-xl md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={User}
                          label="Nombre"
                          placeholder="Tu nombre"
                          disabled={loading}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={fieldState.error?.message}
                          className={cn(AUTH_INPUT_FIELD_CLASS, "text-base")}
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
                          placeholder="tucorreo@ejemplo.com"
                          disabled={loading}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={fieldState.error?.message}
                          className={cn(AUTH_INPUT_FIELD_CLASS, "text-base")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={Phone}
                          label="Teléfono"
                          type="tel"
                          placeholder="+52 55 0000 0000"
                          disabled={loading}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={fieldState.error?.message}
                          className={cn(AUTH_INPUT_FIELD_CLASS, "text-base")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="need"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <InputWithIcon
                          icon={HelpCircle}
                          label="¿Qué necesitas?"
                          placeholder="Ej. agendar citas, soporte 24/7…"
                          disabled={loading}
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          error={fieldState.error?.message}
                          className={cn(AUTH_INPUT_FIELD_CLASS, "text-base")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <InputWithIcon
                        icon={AlignLeft}
                        label="Mensaje"
                        multiline
                        rows={5}
                        placeholder="Cuéntanos brevemente tu caso…"
                        disabled={loading}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        error={fieldState.error?.message}
                        className={cn(
                          AUTH_INPUT_FIELD_CLASS,
                          "min-h-[120px] text-base",
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex flex-col items-stretch gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-6 bg-[#4f39f6] text-white rounded-md inline-flex justify-center items-center gap-2.5 transition-colors hover:bg-[#4f39f6]/90 disabled:opacity-60 text-lg font-semibold"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2.5">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm sm:text-sm md:text-base font-bold font-['Poppins'] leading-normal">
                        Enviando…
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2.5">
                      <span className="text-sm sm:text-sm md:text-base font-bold font-['Poppins'] leading-normal">
                        Enviar
                      </span>
                      <Send className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </div>

              <div aria-live="polite" className="sr-only">
                {submitted ? "Mensaje enviado correctamente" : ""}
              </div>

              {submitted && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  ¡Gracias! Hemos recibido tu mensaje. Te contactaremos pronto.
                </div>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
