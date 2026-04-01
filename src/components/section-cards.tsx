"use client"

import { IconPhone, IconUsers, IconCalendar } from "@tabler/icons-react"
// Eliminado useDashboard del contexto obsoleto

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  // Fallback: sin contexto, mostrar contadores en cero
  const calls: unknown[] = []
  const contacts: unknown[] = []
  const appointments: Array<{ start: { dateTime: string }, end: { dateTime: string }, status?: string }> = []

  // Calculate statistics
  const stats = {
    totalCalls: calls.length,
    activeContacts: contacts.length,
    totalAppointments: appointments.length,
    upcomingAppointments: appointments.filter(app => new Date(app.start.dateTime) > new Date()).length,
    completedAppointments: appointments.filter(app => new Date(app.end.dateTime) < new Date()).length,
    cancelledAppointments: appointments.filter(app => app.status === "cancelled").length || 0
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card bg-white">
        <CardHeader>
          <CardDescription>Total Llamadas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalCalls}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
              <IconPhone className="size-4 text-blue-700" />
              Total
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Llamadas registradas <IconPhone className="size-4 text-blue-700" />
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-white">
        <CardHeader>
          <CardDescription>Total de Contactos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeContacts}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
              <IconUsers className="size-4 text-green-700" />
              Activos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Contactos registrados en el sistema <IconUsers className="size-4 text-green-700" />
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card bg-white">
        <CardHeader>
          <CardDescription>Total de Citas</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.completedAppointments}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
              <IconCalendar className="size-4 text-orange-700" />
              Completadas
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Citas registradas en el sistema <IconCalendar className="size-4 text-orange-700" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
