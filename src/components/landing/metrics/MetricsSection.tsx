import React from "react"
import Image from "next/image"
import MetricCard from "./MetricCard"

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

const metrics: Metric[] = [
  {
    title: "Satisfacción",
    subtitle: "del cliente",
    value: "+98%",
    icon: (
      <div className="flex size-12 items-center justify-center bg-emerald-50 rounded-[3px]">
        <Image 
          src="/icons/icon1.svg" 
          alt="Satisfacción del cliente" 
          width={30}
          height={40}
          className="text-emerald-600" 
          aria-hidden="true" 
        />
      </div>
    ),
    accentClasses: { bg: "bg-emerald-50", text: "text-emerald-600" },
  },
  {
    title: "ROI",
    subtitle: "en el primer año",
    value: "+800%",
    icon: (
      <div className="flex size-12 items-center justify-center bg-purple-50 rounded-[3px]">
        <Image 
          src="/icons/icon2.svg" 
          alt="ROI en el primer año" 
          width={30}
          height={40}
          className="text-purple-600" 
          aria-hidden="true" 
        />
      </div>
    ),
    accentClasses: { bg: "bg-purple-50", text: "text-purple-600" },
  },
  {
    title: "Efectividad",
    subtitle: "en citas programadas",
    value: "+60%",
    icon: (
      <div className="flex size-12 items-center justify-center bg-amber-50 rounded-[3px]">
        <Image 
          src="/icons/icon3.svg" 
          alt="Efectividad en citas programadas" 
          width={30}
          height={40}
          className="text-amber-600" 
          aria-hidden="true" 
        />
      </div>
    ),
    accentClasses: { bg: "bg-amber-50", text: "text-amber-600" },
  },
  {
    title: "Reducción",
    subtitle: "de costos",
    value: "+90%",
    icon: (
      <div className="flex size-12 items-center justify-center bg-violet-50 rounded-[3px]">
        <Image 
          src="/icons/icon4.svg" 
          alt="Reducción de costos" 
          width={30}
          height={40}
          className="text-violet-600" 
          aria-hidden="true" 
        />
      </div>
    ),
    accentClasses: { bg: "bg-violet-50", text: "text-violet-600" },
  },
]

const MetricsSection = () => {
  return (
    <section
      aria-label="Datos de negocio"
      className="w-full px-4 py-12"
    >
      <div className="max-w-7xl mx-auto">
        <h2 
          className="text-center text-2xl mb-8"
          style={{ color: '#303030', fontSize: '24px' }}
        >
          <span className="font-semibold">Tu competencia ya ahorra y vende más con IA…</span>{" "}
          <span className="font-bold">¿y tú, qué esperas?</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <MetricCard key={i} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default MetricsSection