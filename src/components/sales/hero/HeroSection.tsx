"use client"

import React from "react"
import HeroSection from "@/components/shared/HeroSection"

const SalesHeroSection: React.FC = () => {
  const industry = {
    name: "tus ventas",
    color: "bg-[#469F5C]",
    imagePath: "/icons/icon20.svg",
    description: "<span className=\"font-bold\">Lucia</span> recibe, clasifica y responde llamadas al instante, programa visitas y realiza seguimientos automáticos con precisión y eficiencia.",
    features: [
      "Calificación de prospectos",
      "Agendamiento de reuniones", 
      "Seguimiento de leads",
      "Reportes de conversión"
    ],
    rotatingTexts: [
      "Calificación de prospectos",
      "Agendamiento de reuniones",
      "Seguimiento de leads", 
      "Reportes de conversión",
      "Estrategias de venta"
    ]
  }

  return <HeroSection industry={industry} sectionId="sales" />
}

export default SalesHeroSection