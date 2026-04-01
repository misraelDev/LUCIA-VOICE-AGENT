"use client"

import React from "react"
import HeroSection from "@/components/shared/HeroSection"

const EcommerceHeroSection: React.FC = () => {
  const industry = {
    name: "tiendas online",
    color: "bg-[#FF9604]",
    imagePath: "/ecommerce/lucia-human2.webp",
    description: "<span className=\"font-bold\">LucIA</span> impulsa tus ventas y atiende 24/7 las consultas o dudas que tengan tus clientes durante el proceso de compra en tu e-commerce.",
    features: [
      "Especificaciones sobre producto",
      "Recomendación de productos",
      "Estado de tu compra",
      "Campañas, promociones o descuentos"
    ],
    rotatingTexts: [
      "Especificaciones sobre producto",
      "Recomendación de productos", 
      "Estado de tu compra",
      "Campañas, promociones o descuentos"
    ]
  }

  return <HeroSection industry={industry} sectionId="ecommerce" />
}

export default EcommerceHeroSection