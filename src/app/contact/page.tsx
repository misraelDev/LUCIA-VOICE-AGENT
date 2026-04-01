"use client"

import * as React from "react"
import { Suspense } from "react"

import { z } from "zod"
import { Mail, Phone, User, HelpCircle, Send, Loader2, AlignLeft } from "lucide-react"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { InputWithIcon } from "@/components/ui/common/InputWithicon/InputWithIcon"
import { AUTH_INPUT_FIELD_CLASS } from "@/lib/auth-input-styles"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { requestService } from "@/services/RequestService"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingrese un correo electrónico válido"),
  phone: z.string().optional(),
  need: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
  referralCode: z.string().optional(),
  company: z.string().max(0).optional(), // honeypot
})

type ContactFormData = z.infer<typeof contactSchema>

// Componente interno que usa useSearchParams
function ContactForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref') || searchParams.get('referral') || ''

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      need: "",
      message: "",
      referralCode: referralCode,
      company: "",
    },
  })

  async function onSubmit(data: ContactFormData) {
    // Detener bots (honeypot)
    if (data.company) return
    
    setIsLoading(true)
    try {
      const result = await requestService.sendContactEmail(data)

      if (result.success) {
        form.reset()
        toast.success("Mensaje enviado exitosamente")
      } else {
        toast.error(result.error || "Error al enviar el mensaje")
      }
    } catch (error) {
      console.error("Error durante el envío:", error)
      toast.error("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Poppins, sans-serif" }}>
      {/* Left side - Gradient panel */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #2B00FF 0%, #3758F9 100%)`,
        }}
      >
        <Image
          src="/login/lucia.svg"
          alt="Imagen de contacto"
          fill
          className="object-cover"
          quality={100}
          priority
        />
      </div>

      {/* Right side - Contact Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 relative overflow-hidden shadow-xl">

            <div className="relative z-10">
              {/* Logo y texto descriptivo */}
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/logo.png"
                    alt="Logo de Lucía"
                    width={200}
                    height={60}
                    className="h-auto"
                    priority
                  />
                </div>
                <p className="text-sm text-gray-600">
                  ¿Tienes alguna pregunta o necesitas ayuda?
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot */}
                  <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <InputWithIcon
                            icon={User}
                            label="Nombre"
                            placeholder="Tu nombre completo"
                            disabled={isLoading}
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
                            placeholder="tucorreo@ejemplo.com"
                            disabled={isLoading}
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
                    name="phone"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <InputWithIcon
                            icon={Phone}
                            label="Teléfono (opcional)"
                            type="tel"
                            placeholder="+52 55 0000 0000"
                            disabled={isLoading}
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
                    name="need"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <InputWithIcon
                            icon={HelpCircle}
                            label="¿Qué necesitas?"
                            placeholder="Ej. agendar citas, soporte 24/7, consulta..."
                            disabled={isLoading}
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
                    name="message"
                    render={({ field, fieldState }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <InputWithIcon
                            icon={AlignLeft}
                            label="Mensaje"
                            multiline
                            rows={5}
                            placeholder="Cuéntanos brevemente tu caso..."
                            disabled={isLoading}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            error={fieldState.error?.message}
                            className={cn(AUTH_INPUT_FIELD_CLASS, "min-h-[120px]")}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1868db] hover:bg-[#1458c4] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Enviar mensaje
                      </span>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <Link href="/" className="text-[#1868db] hover:text-[#1458c4] font-medium underline">
                  Regresar al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal con Suspense
export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  )
}
