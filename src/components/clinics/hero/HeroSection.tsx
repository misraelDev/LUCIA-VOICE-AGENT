"use client"

import React from "react"
import HeroSection from "@/components/shared/HeroSection"

const ClinicsHeroSection: React.FC = () => {
  const industry = {
    name: "clínicas",
    color: "bg-[#53DDB9]",
    imagePath: "/icons/icon19.svg",
    description: "<span className=\"font-bold\">Lucia</span> optimiza la atención de tus pacientes desde la primera consulta, durante y despues de su atención, mejorando la experiencia del paciente.",
    features: [
      "Consultas sobre síntomas y tratamientos",
      "Tipos de consulta y servicios",
      "Tarifas y disponibilidad para una cita",
      "Confirmación de tu cita"
    ],
    rotatingTexts: [
      "Consultas sobre síntomas y tratamientos",
      "Tipos de consulta y servicios",
      "Tarifas y disponibilidad para una cita",
      "Confirmación de tu cita"
    ]
  }

  return <HeroSection industry={industry} sectionId="clinics" />
}

export default ClinicsHeroSection