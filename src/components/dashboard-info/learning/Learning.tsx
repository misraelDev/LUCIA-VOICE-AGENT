import Image from "next/image"
import { ArrowRight } from 'lucide-react'

export default function LearningSection() {
  return (
    <div className="w-full relative bg-black [background:radial-gradient(50%_50%_at_50%_50%,_#171717_27.4%,_#0a0a0a)] flex flex-col items-center justify-center py-8 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-8 box-border gap-6 sm:gap-12 md:gap-16 text-center text-xl text-darkgray">
      
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-start gap-6 sm:gap-10 md:gap-12 z-10">
        {/* Header Section */}
        <div className="w-full max-w-[806px] flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <p className="mb-2 text-center font-semibold tracking-[0.18em] text-gray-400" style={{ fontSize: "20px" }}>
            APRENDIZAJE
          </p>
          <h2 className="text-center font-bold tracking-tight text-[#F4F4F4]" style={{ fontSize: "40px" }}>
            <span>El conocimiento </span>
            <span style={{ color: "#3ee6ff" }}>es el centro de todo</span>
          </h2>
          <div className="mt-2 sm:mt-3 md:mt-4 space-y-1 sm:space-y-2 tracking-[-0.02em] text-[18px] sm:text-xl text-[#F4F4F4]">
            <p className="font-semibold">
              Tu conocimiento y la experiencia de Lucia: Unificadas.
            </p>
            <p className="font-normal">
              Agrega tu conocimiento en cualquier momento, simplemente selecciona lo que deseas agregar.
            </p>
          </div>
        </div>

        {/* Main Image and Cards Section */}
        <div className="w-full max-w-[1084px] flex flex-col items-center justify-center text-left text-2xl text-[#F4F4F4] -mt-4 sm:-mt-8 md:-mt-12">
          <div className="relative w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px] aspect-square">
            {/* Background glow effect */}
            <Image
              src="/learning/difuminado.png"
              alt="Background glow"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-contain z-0"
              width={600}
              height={600}
            />

            {/* Main Lucia character */}
            <Image
              src="/lucia-intelligent.png"
              alt="Lucia virtual assistant"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] object-contain z-1"
              width={500}
              height={500}
            />

            {/* Floating elements - Optimizados para móvil */}
            <Image
              src="/learning/ticket-2.png"
              alt="Floating ticket"
              className="absolute top-[15%] left-[10%] w-[15%] sm:w-[12%] object-contain animate-float z-20"
              width={60}
              height={60}
            />
            <Image
              src="/learning/code-2.png"
              alt="Floating code"
              className="absolute top-[20%] right-[15%] w-[15%] sm:w-[12%] object-contain animate-float-delay z-20"
              width={60}
              height={60}
            />
            <Image
              src="/learning/ticket-2.png"
              alt="Floating camera"
              className="absolute bottom-[25%] right-[10%] w-[12%] sm:w-[10%] object-contain animate-float z-20"
              width={50}
              height={50}
            />
            <Image
              src="/learning/ticket.png"
              alt="Floating document"
              className="absolute bottom-[20%] left-[15%] w-[15%] sm:w-[12%] object-contain animate-float-delay z-20"
              width={60}
              height={60}
            />
            <Image
              src="/learning/code-blue.png"
              alt="Floating code 2"
              className="absolute top-[45%] left-[2%] w-[12%] sm:w-[10%] object-contain animate-float z-20"
              width={50}
              height={50}
            />
            <Image
              src="/learning/camera.png"
              alt="Floating ticket 2"
              className="absolute top-[50%] right-[2%] w-[12%] sm:w-[10%] object-contain animate-float-delay z-20"
              width={50}
              height={50}
            />
          </div>

          {/* Feature Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 -mt-4 sm:-mt-8 md:-mt-16 font-medium text-[#F4F4F4] relative z-30">
            {/* Website Card */}
            <div className="w-full shadow-[0px_1px_11.8px_#08b8ca] rounded-[5px] [background:linear-gradient(180deg,_#222,_#000)] h-32 sm:h-36 md:h-40 flex flex-col items-start justify-center p-4 sm:p-5 md:p-6 box-border">
              <div className="h-full flex flex-row items-start justify-start gap-3 sm:gap-4">
                <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] relative flex items-center justify-center">
                  <Image src="/learning/web.svg" alt="Website icon" width={50} height={50} className="w-full h-full" />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 sm:gap-3">
                  <div className="font-semibold text-[#F4F4F4]" style={{ fontSize: "24px" }}>Website</div>
                  <div className="font-normal text-[#F4F4F4] leading-relaxed" style={{ fontSize: "16px" }}>
                    <p className="m-0">
                      Lucía puede obtener información de su sitio web
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Archivos Card */}
            <div className="w-full shadow-[0px_1px_11.8px_#08b8ca] rounded-[5px] [background:linear-gradient(180deg,_#222,_#000)] h-32 sm:h-36 md:h-40 flex flex-col items-start justify-center p-4 sm:p-5 md:p-6 box-border">
              <div className="h-full flex flex-row items-start justify-start gap-3 sm:gap-4">
                <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] relative flex items-center justify-center">
                  <Image src="/learning/archive.svg" alt="Archive icon" width={50} height={50} className="w-full h-full" />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 sm:gap-3">
                  <div className="font-semibold text-[#F4F4F4]" style={{ fontSize: "24px" }}>Archivos</div>
                  <div className="font-normal text-[#F4F4F4] leading-relaxed" style={{ fontSize: "16px" }}>
                    <p className="m-0">
                      Carga documentos, catálogos, notas y Lucía aprenderá de ellos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Card */}
            <div className="w-full shadow-[0px_1px_11.8px_#08b8ca] rounded-[5px] [background:linear-gradient(180deg,_#222,_#000)] h-32 sm:h-36 md:h-40 flex flex-col items-start justify-center p-4 sm:p-5 md:p-6 box-border sm:col-span-2 md:col-span-1">
              <div className="h-full flex flex-row items-start justify-start gap-3 sm:gap-4">
                <div className="w-[40px] h-[40px] sm:w-[45px] sm:h-[45px] md:w-[50px] md:h-[50px] relative flex items-center justify-center">
                  <Image src="/learning/faq.svg" alt="FAQ icon" width={50} height={50} className="w-full h-full" />
                </div>
                <div className="flex flex-col items-start justify-start gap-2 sm:gap-3">
                  <div className="font-semibold text-[#F4F4F4]" style={{ fontSize: "24px" }}>FAQs</div>
                  <div className="font-normal text-[#F4F4F4] leading-relaxed" style={{ fontSize: "16px" }}>
                    <p className="m-0">
                      Responde preguntas frecuentes o información adicional del negocio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="self-stretch flex flex-col items-center justify-center gap-4 sm:gap-6 text-[#F4F4F4]">
        <div className="w-full max-w-[1094px] tracking-[-0.02em] font-semibold text-center" style={{ fontSize: "20px" }}>
          <p className="m-0">Ponte en contacto con uno de nuestros asesores</p>
        </div>
        <div className="mt-4 sm:mt-6">
          <button className="w-full lg:w-auto group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] hover:shadow-[0px_12px_25px_-3px_rgba(120,84,247,0.5)] flex justify-center items-center gap-3 transition-all duration-300 hover:scale-105 hover:from-indigo-700 hover:to-indigo-800 active:scale-95">
            <span className="text-center text-white font-semibold text-base">Quiero solicitar una demo</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  )
}