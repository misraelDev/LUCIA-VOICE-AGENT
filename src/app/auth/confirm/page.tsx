"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Poppins } from "next/font/google"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { emailService } from "@/lib/email-service"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function EmailConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Obtener los parámetros del hash de la URL
        const hash = window.location.hash.substring(1) // Remover el #
        const params = new URLSearchParams(hash)
        
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')
        const expiresAt = params.get('expires_at')

        console.log('URL completa:', window.location.href)
        console.log('Hash:', hash)
        console.log('Parámetros encontrados:', { 
          accessToken: !!accessToken, 
          refreshToken: !!refreshToken, 
          type,
          expiresAt
        })

        if (!accessToken) {
          setStatus('error')
          setMessage('No se encontró el token de confirmación. Asegúrate de hacer clic en el enlace completo del email.')
          return
        }

        // Verificar si el token ha expirado
        if (expiresAt) {
          const expirationTime = parseInt(expiresAt) * 1000 // Convertir a milisegundos
          const currentTime = Date.now()
          
          if (currentTime > expirationTime) {
            setStatus('error')
            setMessage('El enlace de confirmación ha expirado. Por favor, solicita un nuevo enlace de confirmación.')
            return
          }
        }

        // Decodificar el token para obtener el email del usuario
        let userEmail = ''
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          userEmail = payload.email
          console.log('Email extraído del token:', userEmail)
          console.log('Payload completo del token:', payload)
        } catch (error) {
          console.error('Error al decodificar el token:', error)
          setStatus('error')
          setMessage('El token de confirmación no es válido.')
          return
        }

        // Verificar el email usando el EmailService
        console.log('Verificando email con el servicio...')
        console.log('Datos a enviar:', { email: userEmail, token: accessToken })
        console.log('Token completo:', accessToken)
        console.log('Tipo de token:', type)
        
        const response = await emailService.verifyEmail({
          email: userEmail,
          token: accessToken
        })

        console.log('Respuesta del servicio:', response)

        if (response.success) {
          console.log('Email verificado exitosamente')
          setStatus('success')
          setMessage('¡Tu email ha sido confirmado exitosamente! Ahora puedes iniciar sesión con tus credenciales.')
          
          // NO guardar tokens automáticamente - el usuario debe iniciar sesión manualmente
          // Esto es más seguro y es una mejor práctica
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        } else {
          console.log('Error en la verificación:', response.message)
          setStatus('error')
          setMessage(response.message || 'No se pudo confirmar tu email. Por favor, intenta nuevamente.')
        }
      } catch (error) {
        console.error('Error inesperado:', error)
        setStatus('error')
        setMessage('Ocurrió un error inesperado. Por favor, intenta nuevamente.')
      }
    }

    confirmEmail()
  }, [router])

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center ${poppins.className}`}>
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-sm text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-16 relative">
            <Image
              src="/logo_lucia_wb.svg"
              alt="Lucia Logo"
              fill
              className="object-contain"
            />
          </div>
          
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-[#1868db]/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#1868db] animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Confirmando tu email...</h1>
              <p className="text-sm text-gray-500">
                Estamos procesando tu confirmación de email.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">¡Email confirmado!</h1>
              <p className="text-sm text-gray-500">
                Tu cuenta ha sido verificada exitosamente. Serás redirigido al login para iniciar sesión.
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Error de confirmación</h1>
              <p className="text-sm text-gray-500">
                {message}
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          {status === 'success' && (
            <Button 
              onClick={() => router.push('/auth/login')}
              className="w-full bg-[#1868db] hover:bg-[#1458c4]"
            >
              Ir al Login
            </Button>
          )}

          {status === 'error' && (
            <div className="space-y-2">
              <Button 
                onClick={() => router.push('/auth/login')}
                className="w-full bg-[#1868db] hover:bg-[#1458c4]"
              >
                Ir al Login
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
                variant="outline"
                className="w-full"
              >
                Registrarse Nuevamente
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
