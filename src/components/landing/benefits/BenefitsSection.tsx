import React from "react"
import Image from "next/image"
import BenefitCard from "@/components/shared/BenefitCard"

type Benefit = {
  title: string
  description: React.ReactNode
  icon: React.ReactNode
}

const defaultBenefits: Benefit[] = [
  {
    title: "Respuestas automáticas, 24/7",
    description: (
      <>
        <span className="font-semibold">LucIA</span> atenderá las llamadas y mensajes, incluso de noche o los fines de semana, para no perder clientes potenciales ni hacerlos esperar.
      </>
    ),
    icon: (
      <Image 
        src="/icons/icon5.svg" 
        alt="Respuestas automáticas 24/7" 
        width={40}
        height={40}
        className="text-[#462bdd]" 
        aria-hidden="true" 
      />
    ),
  },
  {
    title: "Ahorra tiempo para tu equipo",
    description: (
      <>
        Al gestionar llamadas repetitivas, el agente libera a su equipo para que pueda centrarse en el trabajo que realmente necesita de un ser humano.
      </>
    ),
    icon: (
      <Image 
        src="/icons/icon6.svg" 
        alt="Ahorra tiempo para tu equipo" 
        width={40}
        height={40}
        className="text-[#462bdd]" 
        aria-hidden="true" 
      />
    ),
  },
  {
    title: "Funciona con tus sistemas actuales",
    description: (
      <>
        <span className="font-semibold">LucIA</span> se conecta a tus herramientas cotidianas, por lo que se adapta perfectamente al flujo de trabajo sin agregar complejidad.
      </>
    ),
    icon: (
      <Image 
        src="/icons/icon7.svg" 
        alt="Funciona con tus sistemas actuales" 
        width={40}
        height={40}
        className="text-[#462bdd]" 
        aria-hidden="true" 
      />
    ),
  },
  {
    title: "Optimiza procesos y reduce costos",
    description: (
      <>
        Al aprender más sobre tu negocio, elimina los cuellos de botella, aumenta la capacidad de atención y reduce hasta un <span className="font-semibold">92% costes operativos</span>.
      </>
    ),
    icon: (
      <Image 
        src="/icons/icon8.svg" 
        alt="Optimiza procesos y reduce costos" 
        width={40}
        height={40}
        className="text-[#462bdd]" 
        aria-hidden="true" 
      />
    ),
  },
]

interface BenefitsSectionProps {
  items?: Benefit[]
  heading?: string
  brand?: string
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
  items = defaultBenefits,
  heading = "Qué obtienes con ",
  brand = "LucIA",
}) => {
  return (
    <section aria-labelledby="beneficios-heading" className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-16">
        <p 
          className="mb-3 text-center font-semibold tracking-[0.18em]"
          style={{ fontSize: '16px', color: '#606060' }}
        >
          BENEFICIOS
        </p>
        <h2
          id="beneficios-heading"
          className="text-center font-bold leading-tight tracking-tight text-black"
          style={{ fontSize: '48px' }}
        >
          {heading}
          <span style={{ color: '#462bdd' }}>
            {brand}
          </span>
        </h2>

        <div className="mt-10 flex justify-center">
          <div className="grid w-[90%] grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
            {items.map((benefit, i) => (
              <BenefitCard key={i} benefit={benefit} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection