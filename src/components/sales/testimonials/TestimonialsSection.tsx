"use client"

import SectionHeader from "@/components/SectionHeader"
import { SectionLayout } from "../SectionLayout"
import { TestimonialCard } from "@/components/TestimonialCard"

// Constantes con todos los datos
const TESTIMONIALS_DATA = [
  {
    image: "/testimonials/clinica.png",
    brandLogo: "/testimonials/clinicalogo.png",
    text: "Las citas se cancelaban o no se concretaban.\nCon la implementación de LucIA se hizo el seguimiento a cada cliente para garantizar las citas programadas.",
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