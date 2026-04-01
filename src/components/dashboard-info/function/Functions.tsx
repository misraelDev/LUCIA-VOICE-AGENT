import Image from "next/image"

export default function FunctionsSection() {
  return (
    <div className="w-screen relative text-left text-base text-white">
      {/* Curva superior */}
      <div className="absolute top-[-50px] sm:top-[-75px] md:top-[-100px] left-0 w-screen h-[100px] sm:h-[150px] md:h-[200px] bg-[url('/curve-top.svg')] bg-no-repeat bg-cover bg-top z-0" />

      {/* Fondo principal */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#462BDD] to-[#261777] z-0" />

      {/* Contenido principal */}
      <div className="relative z-10 py-8 sm:py-16 md:py-24">
        {/* Sección de título */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-2 sm:gap-6 text-center">
          <div className="font-bold leading-[1.2] sm:leading-[45px] tracking-[-0.02em] text-[24px] sm:text-[40px] text-white">
            Inteligencia de negocio en acción
          </div>
        </div>

        {/* Primera sección - Panel de control */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-1 md:order-1 max-w-[90%] mx-auto md:mx-0 md:mr-auto">
              <div className="space-y-3 sm:space-y-6">
                <p className="font-semibold tracking-[0.18em] text-base sm:text-lg md:text-xl text-[#3ee6ff] uppercase">
                  Panel de control
                </p>
                <h2 className="font-bold leading-[1.2] sm:leading-[45px] tracking-[-0.02em] text-[24px] sm:text-[40px] text-white">
                  <span className="text-[#3ee6ff]">Visualiza </span>
                  todo lo que sucede en tu negocio.
                </h2>
                <div className="space-y-2 sm:space-y-4 tracking-[-0.02em] text-[18px] sm:text-xl text-lightgray">
                  <p>
                    Con Lucia, puedes ver cada interacción que ha tenido de forma clara y fácil de entender.
                  </p>
                  <p>
                    Audita y haz el seguimiento a las conversaciones para detectar oportunidades de mejora y 
                    <span className="font-semibold text-whitesmoke-300"> optimizar el proceso de conversión</span>
                    <span> desde el primer contacto</span>
                  </p>
                </div>
                <div className="space-y-2 sm:space-y-4 text-[18px] sm:text-xl text-whitesmoke-300">
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Historial de llamadas y conversaciones</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Transcripción en tiempo real</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Reproducción de llamadas</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Evaluación de llamadas y NPS</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-2 w-full md:w-[490.6px] relative h-[400px] sm:h-[600px] md:h-[734px]">
              <Image 
                src="/primera-seccion.png" 
                alt="Panel de control de Lucia" 
                fill 
                style={{ objectFit: "contain" }} 
              />
            </div>
          </div>
        </div>

        {/* Segunda sección - Historial de contactos */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-1 md:order-1 max-w-[90%] mx-auto md:mx-0 md:mr-auto">
              <div className="space-y-3 sm:space-y-6">
                <p className="font-semibold tracking-[0.18em] text-base sm:text-lg md:text-xl text-[#3ee6ff] uppercase">
                  Historial de contactos
                </p>
                <h2 className="font-bold leading-[1.2] sm:leading-[45px] tracking-[-0.02em] text-[24px] sm:text-[40px] text-white">
                  <span className="text-[#3ee6ff]">Gestiona </span>
                  y conoce mejor a tus clientes.
                </h2>
                <div className="space-y-2 sm:space-y-4 tracking-[-0.02em] text-[18px] sm:text-xl text-lightgray">
                  <p>
                    Maneja tus clientes registrados de forma más eficiente, adaptado a tus necesidades.
                  </p>
                  <p>
                    Así Lucia conocerá a cada uno y podrá tener una 
                    <span className="font-semibold text-whitesmoke-300"> atención personalizada</span>
                    <span> desde el saludo.</span>
                  </p>
                  <p>Podrás ver:</p>
                </div>
                <div className="space-y-2 sm:space-y-4 text-[18px] sm:text-xl text-whitesmoke-300">
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Ficha detallada del cliente o paciente</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Historial completo de interacciones</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Notas internas del equipo</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Image src="/checkmark-circle-blue.svg" alt="Checkmark" width={18} height={18} className="w-[18px] h-[18px] mt-1" />
                    <span className="font-medium">
                      Canal de contacto preferido (Teléfono, Whatsapp, etc.)
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-2 w-full md:w-[450px] relative h-[350px] sm:h-[500px] md:h-[599px]">
              <Image 
                src="/conversation.png" 
                alt="Interfaz de chat" 
                fill 
                style={{ objectFit: "contain" }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curva inferior */}
      <div className="absolute bottom-[-50px] sm:bottom-[-75px] md:bottom-[-100px] left-0 w-screen h-[100px] sm:h-[150px] md:h-[200px] bg-[url('/curve-bottom.svg')] bg-no-repeat bg-cover bg-bottom z-0" />
    </div>
  )
}