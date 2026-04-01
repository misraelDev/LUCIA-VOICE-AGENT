"use client"
import { Card } from "@/components/ui/card"
import { BedDouble, Building2, TrendingUp, ShoppingBag, Stethoscope } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAgent } from "@/contexts/agent-context"

const industries = [
  {
    icon: BedDouble,
    title: "Hoteles",
    description: "Impulsa tus atención de llamadas..",
    featured: true,
  },
  {
    icon: Building2,
    title: "Inmobiliarias",
    description: "Impulsa tu tasa de conversión..",
    featured: false,
  },
  {
    icon: TrendingUp,
    title: "Ventas",
    description: "Mejora tu ciclo de ventas para cerrar..",
    featured: false,
  },
  {
    icon: ShoppingBag,
    title: "Ecommerce",
    description: "Automatiza tus procesos de atención..",
    featured: false,
  },
  {
    icon: Stethoscope,
    title: "Clínicas",
    description: "Agenda y gestiona citas de pacientes..",
    featured: false,
  },

]

export default function IndustriesPopup() {
  const pathname = usePathname()
  const router = useRouter()
  const { loadModel } = useAgent()

  const hrefByTitle: Record<string, string> = {
    "Hoteles": "/hotels",
    "Inmobiliarias": "/real-estate",
    "Ventas": "/sales",
    "Ecommerce": "/ecommerce",
    "Clínicas": "/clinics",
  }

  const caseValueByTitle: Record<string, string> = {
    "Hoteles": "hoteles",
    "Inmobiliarias": "inmobiliarias",
    "Ventas": "ventas",
    "Ecommerce": "ecommerce",
    "Clínicas": "clinicas",
  }

  const getHref = (title: string) => hrefByTitle[title] || "/hotels"
  const isActive = (href: string) => pathname?.startsWith(href)
  const handleSelect = async (title: string) => {
    const value = caseValueByTitle[title]
    if (value) {
      await loadModel(value)
    }
  }
  const handleNavigate = async (e: React.MouseEvent<HTMLAnchorElement>, title: string, href: string) => {
    e.preventDefault()
    await handleSelect(title)
    router.push(href)
  }

  return (
    <div className="relative">
      {/* Arrow pointing up */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45 shadow-sm" />
      </div>

      {/* Main popup card - responsive width */}
      <Card className="relative bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.15)] rounded-xl border border-gray-100 overflow-hidden w-full sm:w-[600px] md:w-[680px] lg:w-[700px] max-w-[90vw] sm:max-w-[700px] max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {/* Header section - compact */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <h3 className="text-base font-semibold text-black">100% adaptable a cualquier industria</h3>
          </div>
        </div>

        {/* Industries grid - responsive columns */}
        <div className="px-4 sm:px-6 py-4">
          <div className="space-y-3">
            {/* First row - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {industries.slice(0, 3).map((industry, index) => {
                const Icon = industry.icon
                const href = getHref(industry.title)
                return (
                  <Link
                    key={index}
                    href={href}
                    aria-label={`Ir a ${industry.title}`}
                    onClick={(e) => handleNavigate(e, industry.title, href)}
                    className="flex flex-col gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {/* Icon + Title row */}
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isActive(href) ? "text-[#462bdd]" : "text-black"}`} />
                      <h4 className={`font-medium text-sm ${isActive(href) ? "text-[#462bdd]" : "text-black"}`}>{industry.title}</h4>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-black leading-tight">{industry.description}</p>
                  </Link>
                )
              })}
            </div>

            {/* Second row - 3 columns with last empty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {industries.slice(3, 5).map((industry, index) => {
                const Icon = industry.icon
                const href = getHref(industry.title)
                return (
                  <Link
                    key={index + 3}
                    href={href}
                    aria-label={`Ir a ${industry.title}`}
                    onClick={(e) => handleNavigate(e, industry.title, href)}
                    className="flex flex-col gap-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {/* Icon + Title row */}
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${isActive(href) ? "text-[#462bdd]" : "text-black"}`} />
                      <h4 className={`font-medium text-sm ${isActive(href) ? "text-[#462bdd]" : "text-black"}`}>{industry.title}</h4>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-black leading-tight">{industry.description}</p>
                  </Link>
                )
              })}
              {/* Empty third column */}
              <div className="hidden md:block"></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}