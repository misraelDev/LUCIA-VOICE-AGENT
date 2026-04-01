"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  userService,
  type UserDetailResponse,
  subscribeToUserEvents,
} from "@/services/UserService"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  IconUser,
  IconMail,
  IconShield,
  IconCalendar,
  IconCheck,
  IconX,
  IconBuilding,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { type UserData } from "@/services/WebSocketService"
import { formatRoleToSpanish } from "@/lib/format"
import { PageHeaderActions } from "@/components/page-header"

function UserDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [user, setUser] = useState<UserDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true)
        const result = await userService.getUserById(id)
        
        if (result.success && result.data) {
          setUser(result.data)
        } else {
          setError(result.error || "No se encontró el usuario")
        }
      } catch {
        setError("Error al cargar los detalles del usuario")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserDetails()
    }
  }, [id])

  useEffect(() => {
    if (typeof window === "undefined" || !user) return
    if (window.location.hash !== "#organizacion") return
    requestAnimationFrame(() => {
      document
        .getElementById("organizacion")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
  }, [user])

  // WebSocket para actualizaciones del usuario
  useEffect(() => {
    if (!id) return

    // Suscribirse a consulta del usuario específico
    const unsubscribeUserConsulted = subscribeToUserEvents('userConsulted', (userData) => {
      const u = userData as UserData
      if (u.id === id) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                id: u.id,
                email: u.email,
                role: u.role,
                created_at: u.created_at,
                email_confirmed: u.email_confirmed,
              }
            : null,
        )
        toast.success('Datos del usuario actualizados')
      }
    })

    // Cleanup de suscripción
    return () => {
      unsubscribeUserConsulted()
    }
  }, [id])

  function getInitials(email: string): string {
    if (!email) return "?"
    return email
      .split("@")[0]
      .slice(0, 2)
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-600">Cargando detalles del usuario...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <IconX className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Error al cargar el usuario</h2>
          <p className="text-gray-600">{error || "No se encontró el usuario"}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
            <div className="flex flex-col gap-6 p-6">
              <PageHeaderActions>
                <Button variant="outline" onClick={() => router.back()}>
                  Volver
                </Button>
              </PageHeaderActions>

              <p className="text-sm text-muted-foreground">
                Vista solo lectura.
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Información del usuario */}
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconUser className="w-5 h-5" />
                        Información del Usuario
                      </CardTitle>
                      <CardDescription>Datos básicos del usuario</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600",
                          "font-medium text-lg",
                        )}>
                          {getInitials(user.email)}
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{user.email}</p>
                          <p className="text-sm text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <IconMail className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <a 
                            href={`mailto:${user.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {user.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Información del rol y estado */}
                  <Card className="shadow-sm border-gray-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IconShield className="w-5 h-5" />
                        Rol y Estado
                      </CardTitle>
                      <CardDescription>Información sobre el rol y estado del usuario</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <IconShield className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Rol</p>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-sm font-medium",
                            user.role === 'admin' ? "bg-red-100 text-red-800" :
                            user.role === 'seller' ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                          )}>
                            {formatRoleToSpanish(user.role)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {user.email_confirmed ? (
                          <IconCheck className="w-4 h-4 text-green-500" />
                        ) : (
                          <IconX className="w-4 h-4 text-yellow-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-700">Estado del Email</p>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-sm font-medium",
                            user.email_confirmed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          )}>
                            {user.email_confirmed ? "Confirmado" : "Pendiente de confirmación"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card
                  id="organizacion"
                  className="scroll-mt-6 shadow-sm border-gray-200"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconBuilding className="w-5 h-5" />
                      Organización (tenant)
                    </CardTitle>
                    <CardDescription>
                      El menú lateral del usuario sigue la configuración de la organización
                      según su rol (admin, usuario o vendedor).
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user.tenant_id != null && user.tenant_name ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
                        <p className="font-medium text-gray-900">{user.tenant_name}</p>
                        <p className="mt-1 font-mono text-sm text-gray-600">
                          id {user.tenant_id}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Sin organización asignada (menú según configuración por defecto).
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Información adicional */}
                <Card className="shadow-sm border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconCalendar className="w-5 h-5" />
                      Información Adicional
                    </CardTitle>
                    <CardDescription>Detalles sobre la creación y actividad del usuario</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <IconCalendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Fecha de creación</p>
                          <p className="text-sm text-gray-600">
                            {user.created_at ? format(parseISO(user.created_at), "dd/MM/yyyy 'a las' HH:mm", { locale: es }) : 'Fecha no disponible'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <IconUser className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">ID del Usuario</p>
                          <p className="text-sm text-gray-600 font-mono">{user.id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
  )
}

export default UserDetailsPage