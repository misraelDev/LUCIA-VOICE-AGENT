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
    q: "¿Puede Lucía integrarse con mi plataforma de ecommerce?",
    a: (
      <>
        Sí, Lucía se integra perfectamente con las principales plataformas de ecommerce como Shopify, WooCommerce, 
        Magento, y otras. Puede sincronizar inventario, consultar pedidos en tiempo real y actualizar 
        información de clientes automáticamente.
      </>
    ),
  },
  {
    q: "¿Puede Lucía ayudar con el proceso de checkout y pagos?",
    a: (
      <>
        Absolutamente. Lucía puede guiar a los clientes a través del proceso de checkout, explicar opciones 
        de pago, calcular costos de envío e impuestos, y procesar pagos de forma segura. También puede 
        manejar consultas sobre facturas y reembolsos.
      </>
    ),
  },
  {
    q: "¿Cómo maneja Lucía las consultas sobre productos y recomendaciones?",
    a: (
      <>
        Lucía puede responder preguntas detalladas sobre productos, sugerir alternativas basándose en las 
        preferencias del cliente, explicar características técnicas y ofrecer recomendaciones personalizadas. 
        Para consultas complejas, transfiere automáticamente al equipo humano con todo el contexto.
      </>
    ),
  },
  {
    q: "¿Cómo puede Lucía aumentar las ventas y el valor promedio del carrito?",
    a: (
      <>
        Lucía puede sugerir productos complementarios, ofrecer descuentos personalizados, recordar productos 
        abandonados en el carrito y promocionar ofertas especiales basándose en el historial de compras. 
        Esto aumenta las ventas de manera natural y no intrusiva.
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
  subtitle = "Resolvemos todas tus dudas sobre cómo Lucía puede revolucionar la atención al cliente en tu tienda online y mejorar la experiencia de compra de tus clientes.",
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
          titleHighlight="Lucía para ecommerce?"
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
