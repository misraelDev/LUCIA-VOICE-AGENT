import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import FaqCard from "./FaqCard"
import SectionHeader from "@/components/SectionHeader"
    
type FaqItem = {
  q: string
  a: React.ReactNode
}

const FAQS: FaqItem[] = [
  {
    q: "¿Puede Lucía integrarse con mi sistema de gestión hotelera?",
    a: (
      <>
        Sí, Lucía se integra perfectamente con los principales sistemas de gestión hotelera como Opera, 
        PMS, y otros. Puede sincronizar reservas, consultar disponibilidad en tiempo real y actualizar 
        información de huéspedes automáticamente.
      </>
    ),
  },
  {
    q: "¿Puede Lucía ayudar con el check-in y check-out digital?",
    a: (
      <>
        Absolutamente. Lucía puede guiar a los huéspedes a través del proceso de check-in digital, 
        verificar documentos, procesar pagos y enviar las llaves digitales. También puede manejar 
        check-outs y solicitudes de facturas.
      </>
    ),
  },
  {
    q: "¿Cómo puede Lucía mejorar las ventas de servicios adicionales?",
    a: (
      <>
        Lucía puede sugerir servicios adicionales como restaurantes, spa, tours, traslados al aeropuerto 
        y actividades locales basándose en las preferencias del huésped y la disponibilidad. Esto 
        aumenta los ingresos por huésped de manera natural y no intrusiva.
      </>
    ),
  },
  {
    q: "¿Qué pasa si un huésped tiene una emergencia o problema urgente?",
    a: (
      <>
        Lucía está programada para identificar emergencias y problemas urgentes. En estos casos, 
        inmediatamente transfiere la llamada a un miembro del personal humano, enviando toda la 
        información relevante para una atención rápida y eficiente.
      </>
    ),
  },
]

// Divide items en dos columnas equilibradas
function splitInTwo<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)]
}

interface FaqSectionProps {
  items?: FaqItem[]
  title?: string
  subtitle?: string
  label?: string
}

const FaqSection: React.FC<FaqSectionProps> = ({
  items = FAQS,
  subtitle = "Resolvemos todas tus dudas sobre cómo Lucía puede revolucionar la atención al cliente en tu hotel y mejorar la experiencia de tus huéspedes.",
  label = "PREGUNTAS FRECUENTES",
}) => {
  const limitedItems = items.slice(0, 4)
  const [left, right] = splitInTwo(limitedItems)

  return (
    <section aria-labelledby="faq-heading" className="w-full bg-[#f8f8f8]">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-24">
        {/* Soft glow backdrop */}
        <div className="pointer-events-none absolute inset-x-6 top-32 -z-10 hidden h-[520px] rounded-[36px] bg-gradient-to-b from-indigo-50 to-purple-50 blur-xl sm:block" />
        <SectionHeader
          subtitle={label}
          title="¿Preguntas sobre"
          titleHighlight="Lucía para hoteles?"
          description={subtitle}
          titleLayout="same-line"
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Columna izquierda */}
          <Accordion type="single" collapsible className="space-y-4">
            {left.map((item, i) => (
              <AccordionItem key={`l-${i}`} value={`item-${i}`} className="border-0">
                <FaqCard>
                                     <AccordionTrigger
                     className={cn(
                       "group w-full items-start gap-4 px-4 py-4 text-left hover:no-underline [&>svg]:hidden md:px-6 md:py-5"
                     )}
                   >
                     {/* Icono a la izquierda */}
                     <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                       <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                     </span>
                     <span className="text-base font-semibold leading-6  flex-1">
                       {item.q}
                     </span>
                   </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-base leading-6 ">{item.a}</p>
                  </AccordionContent>
                </FaqCard>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Columna derecha */}
          <Accordion type="single" collapsible className="space-y-4">
            {right.map((item, i) => (
              <AccordionItem key={`r-${i}`} value={`item-${i}`} className="border-0">
                                 <FaqCard>
                   <AccordionTrigger className="group w-full items-start gap-4 px-4 py-4 text-left hover:no-underline [&>svg]:hidden md:px-6 md:py-5">
                     <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                       <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                     </span>
                     <span className="text-base font-semibold leading-6  flex-1">
                       {item.q}
                     </span>
                   </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-base leading-6 ">{item.a}</p>
                  </AccordionContent>
                </FaqCard>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default FaqSection
