"use client"

import Image from "next/image"
import { AudioPlayer } from "./AudioPlayer"

interface TestimonialCardProps {
  image: string
  brandLogo: string
  text: string
  audioSrc: string
  result: string
  audioLabel?: string
}

export function TestimonialCard({
  image,
  brandLogo,
  text,
  audioSrc,
  result,
  audioLabel = "Escucha a Lucia en acción"
}: TestimonialCardProps) {
  
  const scrollToContact = () => {
    const contactSection = document.getElementById('contacto')
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <div className="relative border border-slate-200 bg-white p-4 sm:p-6 lg:p-10 shadow-lg">
        {/* Contenedor principal con layout flexible */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-start lg:items-center">
          
          {/* Imagen - Primero en móvil, segundo en desktop */}
          <div className="relative w-full order-2 lg:order-1">
            <Image
              src={image}
              alt="Fachada del hotel cliente"
              width={880}
              height={500}
              className="h-80 sm:h-96 lg:h-[500px] w-full object-contain rounded-sm"
              priority
            />
          </div>
          
          {/* Contenido de texto - Segundo en móvil, primero en desktop */}
          <div className="flex flex-col order-1 lg:order-2 w-full">
            
            {/* Logo */}
            <div className="text-center lg:text-left mb-4 lg:mb-6">
              <Image
                src={brandLogo}
                alt="Logo de la marca"
                width={136}
                height={72}
                className="h-12 w-auto sm:h-16 lg:h-[72px] object-contain mx-auto lg:mx-0"
                priority
              />
            </div>
            
            {/* Texto principal */}
            <div className="mb-6 lg:mb-8">
              <p className="text-base sm:text-lg text-[#303030] leading-relaxed text-center lg:text-left">
                {text}
              </p>
            </div>
            
            {/* Audio section - solo mostrar si hay audioSrc */}
            {audioSrc && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-50 p-4 rounded-xl mt-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.787L4.515 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.515l3.868-2.787z"/>
                      <path d="M14.657 2.343a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-gray-800">{audioLabel}</span>
                </div>
                <AudioPlayer src={audioSrc} />
              </div>
            )}
            
            {/* Resultados */}
            <div className="text-center lg:text-left">
              <span className="text-base font-medium text-gray-700">
                Resultados:
              </span>
              <br />
              <span className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1 inline-block">
                {result}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de contacto */}
      <div className="mx-auto max-w-3xl text-center mt-10">
        <p className="mb-4 font-medium" style={{ fontSize: '20px' }}>
          Agenda una reunión y cuéntanos cómo podemos ayudarte.
        </p>
        <button 
          onClick={scrollToContact}
          className="w-full lg:w-auto bg-white rounded-[60px] shadow-[0px_9px_20px_-3px_rgba(70,43,221,0.33)] border-2 border-[#462bdd] hover:bg-gray-50 transition-colors px-5 py-2.5"
        >
          <span className="text-[#462bdd] text-base font-semibold">
            Contáctanos
          </span>
        </button>
      </div>
    </div>
  )
}