import React from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import FaqCard, { FaqCardContent, FaqCardTitle } from "@/components/FaqCard"

export type FaqItem = {
  q: string
  a: React.ReactNode
}

function splitInTwo<T>(arr: T[]) {
  const mid = Math.ceil(arr.length / 2)
  return [arr.slice(0, mid), arr.slice(mid)] as const
}

type FaqAccordionProps = {
  items: FaqItem[]
  className?: string
}

export default function FaqAccordion({ items, className = "" }: FaqAccordionProps) {
  const [left, right] = splitInTwo(items)

  return (
    <div className={cn("mt-14 grid grid-cols-1 gap-6 md:grid-cols-2", className)}>
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
                <FaqCardTitle className="flex-1">{item.q}</FaqCardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                <FaqCardContent>{item.a}</FaqCardContent>
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
                <FaqCardTitle className="flex-1">{item.q}</FaqCardTitle>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6">
                <FaqCardContent>{item.a}</FaqCardContent>
              </AccordionContent>
            </FaqCard>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}


