"use client"

import React from "react"
import Image from "next/image"
import ChatInterface from "@/components/ChatInterface"

interface HeroSectionProps {
  industry: {
    name: string
    color: string
    imagePath: string
    description: string
    features: string[]
    rotatingTexts: string[]
  }
  sectionId?: string // Nueva prop para identificar la sección
}

// Componente de contenido hero
const HeroContent: React.FC<{ industry: HeroSectionProps['industry'] }> = ({ industry }) => (
  <div className="flex flex-col gap-[18px] text-center md:text-left text-white">
    {/* Título principal */}
    <div className="w-full">
      <h1
        className={`text-white font-bold leading-tight tracking-tight text-[32px] md:text-[48px]`}
      >
        Tu asistente IA para{" "}
        <span className={`${industry.color} px-1 py-0.5 md:px-2 md:py-1 rounded whitespace-nowrap inline-block`}>
          {industry.name}
        </span>
      </h1>
    </div>

    {/* Descripción principal */}
    <div className="w-full">
      <p className={`text-white font-medium leading-relaxed text-[16px] md:text-[18px]`} 
         dangerouslySetInnerHTML={{ __html: industry.description }} />
    </div>

    {/* Texto de prueba */}
    <div className="w-full">
      <p className={`text-white font-medium leading-relaxed text-[16px] md:text-[18px]`}>
        <span className="font-bold">Pon a prueba a Lucia</span>. Conversa con ella y pregúntale:
      </p>
    </div>

    {/* Lista de funcionalidades - Oculta en móvil */}
    <div className="w-full relative hidden md:flex flex-col items-start justify-start gap-3 sm:gap-2.5 text-left">
      {industry.features.map((feature, index) => (
        <div key={index} className="flex flex-row items-start justify-start gap-3 sm:gap-2.5">
          <Image
            className="w-[16px] sm:w-[18px] relative max-h-full overflow-hidden shrink-0 mt-1"
            width={18}
            height={18}
            sizes="18px"
            alt=""
            src="/checkmark-circle-blue.svg"
          />
          <div className="relative leading-6 font-medium text-sm sm:text-base flex items-center gap-2">
            <span>{feature}</span>
            {feature.toLowerCase().includes("whatsapp") && (
              <Image
                className="w-[18px] h-[18px]"
                width={18}
                height={18}
                sizes="18px"
                alt="WhatsApp"
                src="/hotels/e7f35005ce4831c5a04f996dce639dd0fd5f94a9.png"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Componente de imagen hero
const HeroImage: React.FC<{ imagePath: string }> = ({ imagePath }) => (
  <div className="w-full flex justify-center">
    <div className="relative w-full max-w-[560px] md:max-w-[700px] lg:max-w-[660px] md:max-h-[500px] flex items-center justify-center">
      <Image
        src={imagePath}
        alt="Lucia"
        width={635}
        height={810}
        className="w-full h-auto object-contain object-center rounded-3xl md:max-h-[500px]"
        priority
        sizes="(min-width: 1024px) 660px, (min-width: 768px) 700px, 560px"
      />
    </div>
  </div>
)

const HeroSection: React.FC<HeroSectionProps> = ({ industry, sectionId = 'default' }) => {
  const [showChat, setShowChat] = React.useState(false)
  
  // Función simple de traducción que devuelve el texto tal como está
  const t = (key: string) => {
    if (key === "hero.button") return "Habla con Lucía"
    return key
  }

  // Log para debugging
  React.useEffect(() => {
    console.log(`🏠 HeroSection initialized for section: ${sectionId}`)
  }, [sectionId])

  return (
    <section className="w-full [background:linear-gradient(180deg,_#24128b,_#563fd7)]">
      <div className="container mx-auto px-4 pt-12 md:pt-16 pb-0">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center min-h-[500px] md:min-h-[700px] lg:min-h-[600px]">
            {/* Columna 1: Texto (50% del espacio) */}
            <div className="flex flex-col gap-4 sm:gap-6 items-center justify-center">
              <HeroContent industry={industry} />
            </div>
            
            {/* Columna 2: Imagen con botón superpuesto (50% del espacio) */}
            <div className="relative flex flex-col items-center justify-center">
              {!showChat && <HeroImage imagePath={industry.imagePath} />}
              <ChatInterface 
                t={t}   
                showChat={showChat} 
                setShowChat={setShowChat} 
                rotatingTexts={industry.rotatingTexts}
                sectionId={sectionId} // Pasamos el sectionId
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection