import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"

type Metric = {
  title: string
  subtitle: string
  value: string
  icon: React.ReactNode
  accentClasses: {
    bg: string
    text: string
  }
}

interface MetricCardProps {
  metric: Metric
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  return (
    <Card
      className={cn(
        "relative flex items-start gap-4 border border-[#462bdd]/20 bg-white p-4 shadow-sm transition-colors hover:border-[#462bdd]/40 md:p-5"
      )}
    >
      {/* Left: Icon and headings */}
      <div className="flex flex-1 items-start gap-3">
        {metric.icon}
        <div className="min-w-0">
          <div className="text-[18px] font-semibold leading-5 tracking-[-0.01em] text-[#111928]">
            {metric.title}
          </div>
          <div className="text-[14px] leading-5 text-[#637381]">{metric.subtitle}</div>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-[36px] font-extrabold leading-none tracking-tight text-[#111928]">
              {metric.value}
            </span>
            <ArrowUpRight className="ml-1 size-4 text-emerald-500" aria-label="Tendencia al alza" />
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MetricCard
