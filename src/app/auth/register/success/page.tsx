"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Poppins } from "next/font/google"
import { Button } from "@/components/ui/button"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export default function RegisterSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirigir al login después de 5 segundos
    const timeout = setTimeout(() => {
      router.push("/auth/login")
    }, 5000)

    return () => clearTimeout(timeout)
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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">¡Cuenta creada exitosamente!</h1>
          <p className="text-sm text-gray-500">
            Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión para acceder a tu panel de control.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-[#1868db] hover:bg-[#1458c4] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
          >
            Ir a Iniciar Sesión
          </Button>
          <p className="text-sm text-gray-500">
            Serás redirigido al panel de control en unos segundos...
          </p>
        </div>
      </div>
    </div>
  )
} 