"use client"

import React, { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconUsers, IconShield, IconSettings, IconActivity } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { PageHeaderActions } from "@/components/page-header"

export default function AdminHomePage() {
  const router = useRouter()

  // Admin-only debug log
  useEffect(() => {
    console.log("🛠️ AdminHome mounted")
  }, [])

  return (
            <div className="flex flex-col gap-6 p-6">
              <PageHeaderActions>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Administrador
                </Badge>
              </PageHeaderActions>

              {/* Welcome Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconShield className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-blue-900">
                        Bienvenido
                      </h2>
                      <p className="text-blue-700 mt-1">
                        Panel de control administrativo para gestionar usuarios y configuraciones del sistema
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Users Card */}
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => router.push('/dashboard/admin/users')}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconUsers className="w-5 h-5 text-green-600" />
                      Gestión de Usuarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Administra usuarios del sistema, crea nuevos usuarios y gestiona roles
                    </p>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Acceso Directo
                    </Badge>
                  </CardContent>
                </Card>

                {/* System Status Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconActivity className="w-5 h-5 text-blue-600" />
                      Estado del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Monitorea el estado general del sistema y servicios
                    </p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      En Desarrollo
                    </Badge>
                  </CardContent>
                </Card>

                {/* Settings Card */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconSettings className="w-5 h-5 text-purple-600" />
                      Configuraciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Configura parámetros del sistema y preferencias globales
                    </p>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      En Desarrollo
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              {/* REMOVED Acciones Rápidas section */}
              {/* (previous quick actions card has been deleted per request) */}
            </div>
  )
}
