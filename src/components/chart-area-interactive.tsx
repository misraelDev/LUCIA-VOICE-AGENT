"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
// Eliminado useDashboard del contexto obsoleto

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"
// Eliminado tipo Call del contexto obsoleto

export const description = "Gráfico interactivo de llamadas y citas"

const chartConfig = {
  calls: {
    label: "Llamadas",
    color: "#2563eb", // Blue-600
  },
  appointments: {
    label: "Citas",
    color: "#16a34a", // Green-600
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  // Fallback: sin contexto, mostrar gráfico vacío
  const calls: Array<{ date?: string | null }> = []
  const appointments: Array<{ start?: { dateTime?: string } }> = []
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const chartData = React.useMemo(() => {
    // Procesar llamadas
    const callsByDate = calls.reduce((acc: { [key: string]: number }, call: { date?: string | null }) => {
      if (call.date) {
        const date = new Date(call.date).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
      }
      return acc
    }, {})

    // Procesar citas
    const appointmentsByDate = appointments.reduce((acc: { [key: string]: number }, app) => {
      if (app.start?.dateTime) {
        const date = new Date(app.start.dateTime).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + 1
      }
      return acc
    }, {})

    // Combinar datos
    const allDates = new Set([
      ...Object.keys(callsByDate),
      ...Object.keys(appointmentsByDate)
    ])

    return Array.from(allDates).map(date => ({
      date,
      calls: callsByDate[date] || 0,
      appointments: appointmentsByDate[date] || 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [calls, appointments])

  const filteredData = React.useMemo(() => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time to start of day

    const startDate = new Date(now)
    if (timeRange === "30d") {
      startDate.setDate(now.getDate() - 30)
    } else if (timeRange === "7d") {
      startDate.setDate(now.getDate() - 7)
    } else {
      startDate.setDate(now.getDate() - 90)
    }

    return chartData.filter(item => {
      const itemDate = new Date(item.date)
      itemDate.setHours(0, 0, 0, 0) // Reset time to start of day
      return itemDate >= startDate && itemDate <= now
    })
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Actividad del sistema</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {timeRange === "90d" && "Llamadas y citas en los últimos 3 meses"}
            {timeRange === "30d" && "Llamadas y citas en los últimos 30 días"}
            {timeRange === "7d" && "Llamadas y citas en los últimos 7 días"}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRange === "90d" && "Últimos 3 meses"}
            {timeRange === "30d" && "Últimos 30 días"}
            {timeRange === "7d" && "Últimos 7 días"}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Últimos 3 meses</ToggleGroupItem>
            <ToggleGroupItem value="30d">Últimos 30 días</ToggleGroupItem>
            <ToggleGroupItem value="7d">Últimos 7 días</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Seleccionar período"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 días
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center  text-center">
            No hay datos disponibles para este periodo.
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#2563eb"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="#2563eb"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="#16a34a"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="#16a34a"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value: string) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("es-ES", {
                    month: "long",
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value: string) => {
                      return new Date(value).toLocaleDateString("es-ES", {
                        month: "long",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="appointments"
                type="natural"
                fill="url(#fillAppointments)"
                stroke="#16a34a"
                stackId="a"
              />
              <Area
                dataKey="calls"
                type="natural"
                fill="url(#fillCalls)"
                stroke="#2563eb"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

