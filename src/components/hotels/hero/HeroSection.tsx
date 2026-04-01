"use client"

import React from "react"
import HeroSection from "@/components/shared/HeroSection"

const HotelsHeroSection: React.FC = () => {
  const industry = {
    name: "hoteles",
    color: "bg-[#FF576C]",
    imagePath: "/lucia-human2.png",
    description: "<span className=\"font-bold\">Lucia</span> habla con naturalidad y comprende lo que dicen tus clientes. Actúa según tus protocolos y se integra a tus sistemas y proceso de trabajo.",
    features: [
      "Horarios y servicios del hotel",
      "Tarifas y disponibilidad de habitaciones",
      "Reserva una habitación",
      "Confirmación de tu reserva"
    ],
    rotatingTexts: [
      "Horarios de atención",
      "Tarifas de habitaciones",
      "Servicios del hotel",
      "Hacer una reserva",
      "Confirmar mi reserva"
    ]
  }

  return <HeroSection industry={industry} sectionId="hotels" />
}

export default HotelsHeroSection