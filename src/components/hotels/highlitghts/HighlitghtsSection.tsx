import React from "react"
import { SectionWithGrid } from "@/components/shared/SectionWithGrid"
import HighlightCard from "@/components/HighlightCard"
  
type Step = {
  number: number
  title: string
  cardTitle: string
  description: React.ReactNode
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "70%",
    cardTitle: "Tiempo de Respuesta",
    description: (
      <>
        Reducción en tiempo de espera para reservas y consultas de huéspedes.
      </>
    ),
  },
  {
    number: 2,
    title: "24/7",
    cardTitle: "Atención Continua",
    description: (
      <>
        Atención ininterrumpida para huéspedes internacionales en múltiples idiomas.
      </>
    ),
  },
  {
    number: 3,
    title: "85%",
    cardTitle: "Satisfacción del Cliente",
    description: (
      <>
        Incremento en la satisfacción del cliente con respuestas inmediatas y precisas.
      </>
    ),
  },
  {
    number: 4,
    title: "40%",
    cardTitle: "Servicios Adicionales",
    description: (
      <>
        Aumento en ventas de servicios adicionales como spa, restaurantes y tours.
      </>
    ),
  },
]

interface ProcessSectionProps {
  steps?: Step[]
}

const HighlightSection: React.FC<ProcessSectionProps> = ({
  steps = STEPS,
}) => {
  const headerConfig = {
    subtitle: "PUNTOS CLAVE",
    title: "Resultados que",
    titleHighlight: "transforman hoteles",
    titleLayout: 'same-line',
    boldText: "En Sarex",
    description: "Hoteles que implementan Lucía experimentan mejoras significativas en eficiencia operativa y satisfacción del cliente."
  } as const
  return (
    <SectionWithGrid
      id="como-heading"
      backgroundClassName="bg-[#f7faff]"
      header={headerConfig}
      gridClassName="mt-10 
        /* Móvil: Slider horizontal */
        flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide
        /* Tablet y Desktop: Grid normal */
        sm:grid sm:overflow-x-visible sm:snap-none sm:pb-0
        sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
        lg:gap-8 items-stretch"
    >
      {steps.map((step) => (
        <div 
          key={step.number} 
          className="
            /* Móvil: Cards con altura fija para uniformidad */
            flex-shrink-0 w-80 snap-start h-[240px]
            /* Tablet y Desktop: Comportamiento normal */
            sm:flex-shrink sm:w-auto sm:snap-align-none sm:h-full"
        >
          <HighlightCard 
            title={step.title} 
            cardTitle={step.cardTitle} 
            description={step.description}
            className="flex-1" 
          />
        </div>
      ))}
    </SectionWithGrid>
  )
}

export default HighlightSection