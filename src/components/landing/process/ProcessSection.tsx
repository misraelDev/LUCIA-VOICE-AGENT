import React from "react"
import ProcessStep from "./ProcessStep"
import { SectionWithGrid } from "@/components/shared/SectionWithGrid"

type Step = {
  number: number
  title: string
  description: React.ReactNode
  iconSrc: string
}

const STEPS: Step[] = [
  {
    number: 1,
    title: "Descubrimos",
    description: (
      <>
        Aprendemos sobre su negocio y descubrimos qué tipo de agente necesita.
      </>
    ),
    iconSrc: "/icons/icon9.svg"
  },
  {
    number: 2,
    title: "Personalizamos",
    description: (
      <>
        Planificamos de principio a fin y brindamos información para un agente
        de voz de alto impacto.
      </>
    ),
    iconSrc: "/icons/icon10.svg"
  },
  {
    number: 3,
    title: "Desarrollo",
    description: (
      <>
        <span className="font-semibold">LucIA</span> y sus automatizaciones se
        construyen y se conectan a sus sistemas.
      </>
    ),
    iconSrc: "/icons/icon11.svg"
  },
  {
    number: 4,
    title: "Testeo",
    description: (
      <>
        Hacemos una prueba final, luego <span className="font-semibold">LucIA</span> se
        activa y comienza a atender llamadas.
      </>
    ),
    iconSrc: "/icons/icon12.svg"
  },
]

interface ProcessSectionProps {
  steps?: Step[]
}

const ProcessSection: React.FC<ProcessSectionProps> = ({
  steps = STEPS,
}) => {
  return (
    <SectionWithGrid
      id="como-heading"
      header={{
        subtitle: "COMO LO HACEMOS",
        title: "No es magia,",
        titleHighlight: "es LucIA",
        titleLayout: "same-line",
        boldText: "",
        description: (
          <>
            Diseñamos, configuramos e implementamos a LucIA adaptada a cómo ya trabajas.
            <br />
            <span className="font-bold">Y lo dejamos funcionando en días, no en meses.</span>
          </>
        ),
      }}
      gridClassName="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {steps.map((step) => (
        <ProcessStep key={step.number} step={step} />
      ))}
      <div className="mx-auto max-w-3xl text-center mt-10 col-span-full">
        <p className="mb-6 font-medium" style={{ fontSize: '20px' }}>
          Agenda una reunión y cuéntanos cómo podemos ayudarte.
        </p>
        <button 
          onClick={() => {
            document.getElementById('contacto')?.scrollIntoView({ 
              behavior: 'smooth' 
            });
          }}
          className="w-full lg:w-auto bg-white rounded-[60px] shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] outline-2 outline-offset-[-2px] outline-indigo-700 hover:bg-gray-50 transition-colors px-10 py-4 cursor-pointer inline-flex justify-center items-center"
        >
          <span className="text-indigo-700 text-base sm:text-lg font-semibold">
            Contáctanos
          </span>
        </button>
      </div>
    </SectionWithGrid>
  )
}

export default ProcessSection