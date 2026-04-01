"use client"

import SectionHeader from "@/components/SectionHeader"
import { SectionLayout } from "../SectionLayout"
import { TestimonialCard } from "@/components/TestimonialCard"

// Constantes con todos los datos
const TESTIMONIALS_DATA = [
  {
    image: "/testimonials/ecommerce.png",
    brandLogo: "/testimonials/ecommercelogo.png",
    text: "Los clientes escribían o llamaban para preguntar sobre el estado de sus compras pero las respuestas tardaban o no era clara.\nCon la implementación de LucIA se mejoró el tiempo de respuesta y la experiencia post-venta con los clientes, eso aumentó la re-compra.",
    audioSrc: "", // Temporalmente deshabilitado hasta que se agregue el archivo real
    result: "+35% de conversión en leads"
  }
]

const SECTION_CONFIG = {
  subtitle: "TESTIMONIOS",
  title: "Escucha las",
  titleHighlight: "historias de éxito",
  audioLabel: "Escucha a LucIA en acción",
  resultLabel: "Resultados:"
}

export default function TestimonialsSection() {
  const testimonial = TESTIMONIALS_DATA[0]
  return (
    <SectionLayout id="testimonios" className="bg-[#ffffff]">
      <SectionHeader
        subtitle={SECTION_CONFIG.subtitle}
        title={SECTION_CONFIG.title}
        titleHighlight={SECTION_CONFIG.titleHighlight}
        align="center"
        titleLayout="same-line"
      />
      <div className="mt-8">
        <TestimonialCard
          image={testimonial.image}
          brandLogo={testimonial.brandLogo}
          text={testimonial.text}
          audioSrc={testimonial.audioSrc}
          result={testimonial.result}
        />
      </div>
    </SectionLayout>
  )
}