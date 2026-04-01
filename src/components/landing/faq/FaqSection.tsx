// FaqSection.tsx
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
    q: "¿Cuánto te cuesta una recepcionista 24/7?",
    a: (
      <>
        Seamos sinceros. Sabemos que capacitar y contratar al mejor talento humano en atención al cliente
        es una inversión de tiempo, dinero y esfuerzo. Con Sofía tendrías un asesor dedicado y aprendiendo
        constantemente de tu negocio y de tus clientes por un costo mucho más accesible.
      </>
    ),
  },
  {
    q: "¿Puedo controlar lo que hace Sofía?",
    a: (
      <>
        Sí. Definimos el alcance, flujos y respuestas. Puedes revisar y ajustar políticas, vocabulario y
        reglas de negocio en cualquier momento.
      </>
    ),
  },
  {
    q: "¿Sustituiría a mi equipo de asesores?",
    a: (
      <>
        No necesariamente. Sofía se enfoca en tareas repetitivas y de alto volumen, y escala con contexto a
        un humano cuando lo necesita.
      </>
    ),
  },
  {
    q: "¿Cómo se integra con mis sistemas?",
    a: (
      <>
        Usamos conectores y APIs estándar para calendarización, CRM, pagos y más. Evaluamos tu stack y
        proponemos la mejor ruta técnica.
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
  title = "¿Aún tienes dudas?",
  subtitle = "Resolvemos todas tus preguntas sobre cómo Lucía puede transformar tu negocio y mejorar la atención al cliente.",
  label = "PREGUNTAS FRECUENTES",
}) => {
  const limitedItems = items.slice(0, 4)
  const [left, right] = splitInTwo(limitedItems)

  return (
    <section aria-labelledby="faq-heading" className="w-full bg-[#f8f8f8]">
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-16">
        {/* Soft glow backdrop */}
        <div className="pointer-events-none absolute inset-x-6 top-32 -z-10 hidden h-[520px] rounded-[36px] bg-gradient-to-b from-indigo-50 to-purple-50 blur-xl sm:block" />
        
        <SectionHeader
          subtitle={label}
          title={title}
          description={subtitle}
          titleLayout="separate"
          align="center"
        />

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Columna izquierda */}
          <Accordion type="single" collapsible className="space-y-4">
            {left.map((item, i) => (
              <AccordionItem key={`l-${i}`} value={`item-${i}`} className="border-0">
                <FaqCard>
                  <AccordionTrigger
                    className={cn(
                      "group w-full items-start gap-4 px-4 py-6 text-left hover:no-underline [&>svg]:hidden md:px-6 md:py-7"
                    )}
                  >
                    {/* Icono a la izquierda */}
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                      <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                    </span>
                    <span className="text-base font-semibold leading-6 flex-1">
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-base leading-6" style={{ color: '#606060' }}>{item.a}</p>
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
                  <AccordionTrigger className="group w-full items-start gap-4 px-4 py-6 text-left hover:no-underline [&>svg]:hidden md:px-6 md:py-7">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                      <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                    </span>
                    <span className="text-base font-semibold leading-6 flex-1">
                      {item.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                    <p className="text-base leading-6" style={{ color: '#606060' }}>{item.a}</p>
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
