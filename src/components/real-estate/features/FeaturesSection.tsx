"use client";

import type React from "react";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";

interface TimelineStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  position: "top" | "bottom";
  highlight?: string;
}

const timelineSteps: TimelineStep[] = [
  {
    id: 1,
    title: "Llamada desde un número local",
    description:
      "llama desde un numero local e igual a la ubicación del prospecto.",
    icon: <Image src="/icons/icon21.svg" alt="Icono" width={40} height={40} />,
    position: "top",
    highlight: "LucIA",
  },
  {
    id: 2,
    title: "Multiplica la probabilidad de conversión.",
    description:
      "Nuestro método permite aumentar la conversión en la primera llamada.",
    icon: <Image src="/icons/icon22.svg" alt="Icono" width={40} height={40} />,
    position: "bottom",
  },
  {
    id: 3,
    title: "Dual Call Combo en acción",
    description: "llama al prospecto para aumentar la tasa de respuesta.",
    icon: <Image src="/icons/icon23.svg" alt="Icono" width={40} height={40} />,
    position: "top",
    highlight: "LucIA",
  },
  {
    id: 4,
    title: "Recepción Inteligente",
    description:
      "gestiona llamadas entrantes y salientes. incluso las llamadas perdidas se convierten en oportunidades.",
    icon: <Image src="/icons/icon24.svg" alt="Icono" width={40} height={40} />,
    position: "bottom",
    highlight: "LucIA",
  },
  {
    id: 5,
    title: "Perfect timing",
    description: "Identifica horarios óptimos para duplicar la efectividad.",
    icon: <Image src="/icons/icon25.svg" alt="Icono" width={40} height={40} />,
    position: "top",
  },
];

export default function FeaturesSection() {
  const topSteps = timelineSteps.filter((step) => step.position === "top");
  const bottomSteps = timelineSteps.filter((step) => step.position === "bottom");

  return (
    <div className="w-full bg-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <SectionHeader
          subtitle="CARACTERÍSTICAS"
          title="Reactivación automática de"
          titleHighlight="clientes con LucIA."
          boldText="Tienes leads que alguna vez mostraron interés, pero quedaron olvidados."
          description="Convierte esa base de datos en una máquina de ventas y obtén resultados visibles con nuestras estrategias de reactivación:"
          titleLayout="same-line"
          align="center"
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Desktop Layout - Simplified with image */}
          <div className="hidden lg:block">
            <div className="flex justify-center items-center py-8">
              <Image
                src="/icons/diagrama.webp"
                alt="Diagrama de reactivación automática de clientes"
                width={1200}
                height={900}
                className="w-full max-w-6xl h-auto mx-auto"
                priority
              />
            </div>
          </div>

          {/* Mobile Layout - Vertical Timeline */}
          <div className="lg:hidden">
            <div className="relative">
              {/* Vertical timeline line - Centrada en 8 (32px) */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300" />

              {/* Timeline steps */}
              {timelineSteps.map((step) => (
                <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                  {/* Circle - Posicionado exactamente en left-8 menos la mitad del ancho del círculo */}
                  <div className="absolute left-6 w-4 h-4 bg-gray-400 rounded-full border-4 border-white z-10" />
                  
                  {/* Horizontal dashed line from circle */}
                  <div className="absolute left-8 top-2 w-6 h-0.5 border-t-2 border-dashed border-gray-300" />

                  {/* Content */}
                  <div className="ml-16 flex-1">
                    <div className="flex items-center mb-3">
                      <div
                        className="mr-3 text-[#462BDD]"
                      >
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-xl text-[#303030] leading-tight">{step.title}</h3>
                    </div>
                    <p className="text-base text-[#303030] leading-relaxed font-medium">
                      {step.highlight && (
                        <>
                          <span className="font-bold text-[#303030]">{step.highlight}</span>{" "}
                        </>
                      )}
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Results section - Separate from timeline */}
            <div className="flex justify-center mt-8">
              <div className="relative w-[372px] h-[61px] rounded-[100px] bg-[#5E3BDA] text-white">
                <div className="absolute top-[18px] left-[22px] text-[33px] leading-[23px] font-bold">
                  7% a <span className="font-extrabold">14%</span>
                </div>
                <div className="absolute top-[11px] left-[199px] text-xl leading-[17px] font-medium text-left w-[162px] h-[39px]">
                  Clientes reactivados
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}