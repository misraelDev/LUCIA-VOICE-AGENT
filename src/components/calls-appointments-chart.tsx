"use client"

import { useState, useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
  ChartRoot,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useStableChartWidth } from "@/hooks/use-stable-chart-width"
import { useDashboardStats, useAllStats, useStatsWebSocket } from "@/hooks/useStats"

const CHART_HEIGHT = 150

interface CallsAppointmentsChartProps {
  selectedTimeRange?: "1 año" | "3 meses" | "30 días" | "7 días"
  onTimeRangeChange?: (range: "1 año" | "3 meses" | "30 días" | "7 días") => void
}

const chartConfig = {
  llamadas: {
    label: "Llamadas",
    color: "hsl(221.2 83.2% 53.3%)", // blue-600
  },
  citas: {
    label: "Citas", 
    color: "hsl(142.1 76.2% 36.3%)", // green-600
  },
} satisfies ChartConfig

export function CallsAppointmentsChart({
  selectedTimeRange = "1 año",
  onTimeRangeChange,
}: CallsAppointmentsChartProps) {
  const [activeTimeRange, setActiveTimeRange] = useState<"1 año" | "3 meses" | "30 días" | "7 días">(selectedTimeRange)
  
  // Usar React Query hooks para obtener datos
  const { data: dashboardStats, isLoading: isLoadingDashboard } = useDashboardStats()
  const { data: allStats, isLoading: isLoadingAll } = useAllStats()
  
  // Suscribirse a actualizaciones WebSocket (actualiza el cache automáticamente)
  useStatsWebSocket()

  const isLoading = isLoadingDashboard || isLoadingAll
  const summaryData = dashboardStats?.summary || null
  const historicalData = dashboardStats?.historicalData || []
  const { ref: chartWrapRef, width: chartWidth, ready: chartWidthReady } =
    useStableChartWidth()

  // Función para obtener días según el rango
  const getDaysForRange = (range: "1 año" | "3 meses" | "30 días" | "7 días") => {
    switch (range) {
      case "1 año": return 365
      case "3 meses": return 90
      case "30 días": return 30
      case "7 días": return 7
      default: return 365
    }
  }

  const handleTimeRangeChange = (range: "1 año" | "3 meses" | "30 días" | "7 días") => {
    setActiveTimeRange(range)
    onTimeRangeChange?.(range)
  }

  // Procesar datos de la API aplicando filtros de tiempo
  const chartData = useMemo(() => {
    if (!allStats) return historicalData

    const now = new Date()
    const maxAgeDays = getDaysForRange(activeTimeRange)
    
    // Función para verificar si una fecha está dentro del rango
    const isWithinRange = (dateStr: string) => {
      const date = new Date(dateStr)
      const diffMs = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      return diffDays >= 0 && diffDays <= maxAgeDays
    }

    // Agrupar por fecha
    const countsByDate = new Map<string, { llamadas: number; citas: number }>()

    // Procesar llamadas - filtrar por rango de tiempo
    for (const call of allStats.calls) {
      const callDate = call.date.split('T')[0] // Extraer solo la fecha YYYY-MM-DD
      
      if (!isWithinRange(callDate)) continue
      
      const prev = countsByDate.get(callDate) || { llamadas: 0, citas: 0 }
      prev.llamadas += 1
      countsByDate.set(callDate, prev)
    }

    // Procesar citas - filtrar por rango de tiempo
    for (const appointment of allStats.appointments) {
      if (!isWithinRange(appointment.date)) continue
      
      const prev = countsByDate.get(appointment.date) || { llamadas: 0, citas: 0 }
      prev.citas += 1
      countsByDate.set(appointment.date, prev)
    }

    // Convertir a array y ordenar por fecha
    const chartDataArray = Array.from(countsByDate.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([dateKey, counts]) => {
        // Formatear fecha para mostrar en el eje X
        const [year, month, day] = dateKey.split('-')
        const displayLabel = `${day}/${month}`
        
        return {
          month: displayLabel,
          date: dateKey,
          llamadas: counts.llamadas,
          citas: counts.citas
        }
      })

    return chartDataArray.length > 0 ? chartDataArray : historicalData
  }, [allStats, historicalData, activeTimeRange])

  // Calcular totales para el rango seleccionado
  const totalsForRange = useMemo(() => {
    const totalLlamadas = chartData.reduce((sum, item) => sum + (item.llamadas || 0), 0)
    const totalCitas = chartData.reduce((sum, item) => sum + (item.citas || 0), 0)
    return { totalLlamadas, totalCitas }
  }, [chartData])

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="pb-0 pt-2 px-4">
        <div className="flex min-h-[4.25rem] flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="min-w-0 sm:flex-1">
            <CardTitle className="text-sm leading-tight">
              Llamadas y citas atendidas por Lucia en {activeTimeRange}
            </CardTitle>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-gray-700 sm:min-w-[11rem] sm:flex-1 sm:justify-center">
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: chartConfig.llamadas.color }}
              />
              <span className="tabular-nums">
                Llamadas: {totalsForRange.totalLlamadas}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: chartConfig.citas.color }}
              />
              <span className="tabular-nums">
                Citas: {totalsForRange.totalCitas}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-0.5 sm:flex-1 sm:justify-end">
            {(["1 año", "3 meses", "30 días", "7 días"] as const).map((range) => (
              <Button
                key={range}
                size="sm"
                variant={activeTimeRange === range ? "default" : "outline"}
                onClick={() => handleTimeRangeChange(range)}
                className={`h-7 rounded-[5px] px-3 py-1 text-xs ${
                  activeTimeRange === range
                    ? "bg-[#462bdd] text-white hover:bg-[#462bdd]/90"
                    : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 px-3 pt-1 pb-2 w-full">
        {/* ref siempre montado: el ancho se mide también en "Cargando" y no hay salto 0→ancho al terminar la petición */}
        <div
          ref={chartWrapRef}
          className="min-h-[150px] w-full shrink-0"
        >
          {isLoading ? (
            <div className="flex h-[150px] items-center justify-center w-full">
              <div className="text-center text-gray-500">
                <div className="text-xs font-medium">Cargando datos...</div>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="h-[150px] min-h-[150px] w-full">
              <ChartRoot config={chartConfig} className="h-full">
                {chartWidthReady && chartWidth != null ? (
                  <LineChart
                    accessibilityLayer
                    width={chartWidth}
                    height={CHART_HEIGHT}
                    data={chartData}
                    margin={{
                      left: 8,
                      right: 8,
                      top: 4,
                      bottom: 8,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 11 }}
                    />
                    <ChartTooltip
                      cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1 }}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      dataKey="llamadas"
                      type="monotone"
                      stroke={chartConfig.llamadas.color}
                      strokeWidth={3}
                      dot={{ fill: chartConfig.llamadas.color, r: 5 }}
                      activeDot={{
                        r: 7,
                        stroke: chartConfig.llamadas.color,
                        strokeWidth: 2,
                      }}
                      connectNulls={false}
                    />
                    <Line
                      dataKey="citas"
                      type="monotone"
                      stroke={chartConfig.citas.color}
                      strokeWidth={3}
                      dot={{ fill: chartConfig.citas.color, r: 5 }}
                      activeDot={{
                        r: 7,
                        stroke: chartConfig.citas.color,
                        strokeWidth: 2,
                      }}
                      connectNulls={false}
                    />
                  </LineChart>
                ) : (
                  <div className="h-full min-h-[150px] w-full" aria-hidden />
                )}
              </ChartRoot>
            </div>
          ) : (
            <div className="flex min-h-[150px] items-center justify-center w-full">
              <div className="text-center text-gray-500">
                <div className="text-xs font-medium">
                  No hay datos disponibles para {activeTimeRange}
                </div>
                <div className="text-[10px] text-gray-400 mt-1">
                  Selecciona un rango diferente
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}