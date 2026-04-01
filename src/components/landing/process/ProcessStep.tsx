import React from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

type Step = {
  number: number
  title: string
  description: React.ReactNode
  iconSrc: string
}

interface ProcessStepProps {
  step: Step
}

const ProcessStep: React.FC<ProcessStepProps> = ({ step }) => {
  return (
    <Card
      className="relative flex flex-col gap-6 border border-[#462bdd]/20 bg-white px-8 md:px-10 py-6 md:py-8 shadow-sm transition-colors hover:border-[#462bdd]/40 h-full"
    >
      {/* Header más compacto */}
      <div className="flex items-center justify-between">
        <div className="flex size-12 items-center justify-center bg-[#462bdd]/10 rounded">
          <span className="text-2xl font-extrabold leading-none text-[#462bdd]">
            {step.number}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <Image 
            src={step.iconSrc} 
            alt={step.title} 
            width={28}
            height={28}
            className="text-[#462bdd]" 
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Contenido con mejor spacing */}
      <div className="min-w-0 space-y-3">
        <h3 
          className="font-semibold leading-snug tracking-tight"
          style={{ fontSize: '26px', color: '#303030' }}
        >
          {step.title}
        </h3>
        <p 
          style={{ fontSize: '17px', color: '#606060' }}
        >
          {step.description}
        </p>
      </div>
    </Card>
  )
}

export default ProcessStep