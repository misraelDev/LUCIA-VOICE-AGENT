"use client"

import React from "react"
import HeroSection from "@/components/shared/HeroSection"

const RealEstateHeroSection: React.FC = () => {
  const industry = {
    name: "inmobiliarias",
    color: "bg-[#376EF9]",
    imagePath: "/real-estate/lucia-human2.webp",
    description: "<span className=\"font-bold\">LuCIA</span> atiende llamadas 24/7, precalifica prospectos, agenda visitas, da seguimiento por voz y WhatsApp, y registra todo en un panel de control.",
    features: [
      "Información de propiedades según tu preferencia (presupuesto, ubicación, etc.)",
      "Horarios disponibles para agendar visitas con agentes",
      "Comparte tu número con prefijo y recibe la info por WhatsApp"
    ],
    rotatingTexts: [
      "Información de propiedades por preferencia",
      "Horarios disponibles para visitas",
      "Información enviada por WhatsApp"
    ]
  }

  return <HeroSection industry={industry} sectionId="real-estate" />
}

export default RealEstateHeroSection