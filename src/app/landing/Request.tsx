import type { NextPage } from "next"
import Image from "next/image"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const RequestPage: NextPage = () => {
  return (
    <div
      className={`w-full relative bg-[#f6f6ff] flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 lg:py-[60px] px-4 sm:px-6 md:px-8 lg:px-[100px] box-border text-center text-darkslategray-200 ${poppins.className}`}
    >
      <div className="flex flex-col items-center justify-start gap-6 sm:gap-8 md:gap-10 lg:gap-[46px] max-w-7xl w-full">
        {/* TITULOS */}
        <div className="w-full max-w-[806px] flex flex-col items-center justify-center gap-3 sm:gap-4 md:gap-[18px]">
          <div className="self-stretch tracking-[0.1em] uppercase font-semibold text-darkslategray-200 text-xs sm:text-sm md:text-base lg:text-xl">
            Solicitud de Servicio
          </div>
          <div className="self-stretch text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[50px] tracking-[-0.02em] leading-tight sm:leading-8 md:leading-10 lg:leading-[60px] font-bold flex flex-col justify-center">
            <span className="text-darkslategray-200">Solicita tu</span>
            <span className="text-indigo-700 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight sm:leading-8 md:leading-10 lg:leading-[60px]">
              Agente Virtual
            </span>
          </div>
          <div className="w-full max-w-[722px] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl tracking-[-0.02em] text-darkslategray-100">
            <p className="m-0">
              Nuestro equipo está listo para ayudarte a implementar Lucia en tu negocio.{" "}
              <b className="font-poppins text-darkslategray-100">
                Completa el formulario y te contactaremos en menos de 24 horas.
              </b>
            </p>
          </div>
        </div>

        {/* DIAGRAMA CENTRAL */}
        <div className="w-full max-w-[1084px] flex flex-col items-center justify-center text-left text-xs text-mediumblue">
          <div className="w-full max-w-[978px] relative">
            {/* Layout móvil y tablet */}
            <div className="flex flex-col lg:hidden items-center justify-center gap-6 sm:gap-8">
              {/* Cliente */}
              <div className="flex flex-col items-center">
                <div className="relative w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] md:w-[200px] md:h-[200px]">
                  <Image
                    className="absolute top-0 left-0 w-full h-full"
                    width={200}
                    height={200}
                    alt="Ellipse"
                    src="/request/cale.svg"
                  />
                </div>
                {/* Cuadro de conversación móvil - más responsivo */}
                <div className="mt-3 sm:mt-4 relative flex items-center justify-center w-full max-w-[280px] px-4">
                  <div className="relative bg-white rounded-lg shadow-sm p-3 w-full min-w-[240px]">
                    <div className="flex items-center gap-3">
                      <Image
                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                        width={48}
                        height={48}
                        alt="Avatar"
                        src="/request/avatar.png"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm sm:text-base font-semibold text-[#462bdd] truncate">Cliente</span>
                          <span className="text-xs sm:text-sm text-mediumslateblue whitespace-nowrap">2 min</span>
                        </div>
                        <div className="text-xs sm:text-sm text-darkslategray-300">
                          <span>En espera | </span>
                          <b className="text-[#462bdd]">15 Nov</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Puntos conectores verticales */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#f1aba5]" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#f1aba5]" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#f1aba5]" />
              </div>

              {/* Lucia */}
              <div className="flex flex-col items-center">
                <div className="relative w-[182px] h-[220px] sm:w-[200px] sm:h-[240px] md:w-[220px] md:h-[260px] flex items-center justify-center">
                  {/* Círculo de fondo */}
                  <div className="absolute rounded-[50%] bg-mediumblue w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[190px] md:h-[190px]" />
                  {/* Imagen de Lucia - ahora sin recorte */}
                  <Image
                    className="relative z-10 w-full h-full object-contain"
                    width={220}
                    height={260}
                    alt="Lucia"
                    src="/lucia-section.png"
                  />
                </div>
                <div className="mt-3 sm:mt-4 text-center">
                  <b className="text-lg sm:text-xl leading-normal text-indigo-700">Lucia</b>
                </div>
              </div>

              {/* Puntos conectores verticales */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#bdb0ff]" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#bdb0ff]" />
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#bdb0ff]" />
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col items-center">
                <div className="w-[240px] sm:w-[280px] md:w-[293px]">
                  <Image
                    className="w-full h-auto object-cover"
                    width={293}
                    height={251}
                    alt="WhatsApp"
                    src="/request/whats.png"
                  />
                </div>
                {/* Cuadro de conversación WhatsApp - más responsivo */}
                <div className="mt-3 sm:mt-4 relative flex items-center justify-center w-full max-w-[280px] px-4">
                  <div className="relative bg-white rounded-lg shadow-sm p-3 w-full min-w-[240px]">
                    <div className="flex items-center gap-3">
                      <Image
                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                        width={48}
                        height={48}
                        alt="Avatar"
                        src="/request/avatar.png"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm sm:text-base font-semibold text-[#462bdd] truncate">Cliente</span>
                          <span className="text-xs sm:text-sm text-mediumslateblue whitespace-nowrap">2 min</span>
                        </div>
                        <div className="text-xs sm:text-sm text-darkslategray-300">
                          <span>En espera | </span>
                          <b className="text-[#462bdd]">15 Nov</b>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout desktop - Mantenemos el diseño original */}
            <div className="hidden lg:block w-[997.9px] relative h-[296px]">
              {/* Cliente */}
              <div className="absolute top-[0px] left-[0px] w-[367.3px] h-[250.9px]">
                <Image
                  className="absolute top-[34.95px] left-[0px] w-[215px] h-[216px]"
                  width={215}
                  height={216}
                  alt="Ellipse"
                  src="/request/cale.svg"
                />
                <div className="absolute top-[0px] left-[107.25px] w-[260px] h-[62px]">
                  <div className="absolute top-[0px] left-[26px] rounded bg-white w-[234px] h-[62px]" />
                  <Image
                    className="absolute top-[5px] left-[0px] rounded-[50%] w-[52px] h-[52px] object-cover"
                    width={52}
                    height={52}
                    alt="Avatar"
                    src="/request/avatar.png"
                  />
                  <div className="absolute top-[14px] left-[calc(50%_-_68px)] text-base leading-[10px] font-semibold text-[#462bdd]">
                    Cliente
                  </div>
                  <div className="absolute top-[15px] left-[calc(50%_+_18px)] leading-[10px] text-mediumslateblue">
                    2 min
                  </div>
                  <div className="absolute top-[34px] left-[calc(50%_-_66px)] leading-[10px] text-darkslategray-300">
                    <span>En espera | </span>
                    <b className="text-[#462bdd]">15 Nov</b>
                  </div>
                </div>
              </div>

              {/* Puntos conectores izquierdos */}
              <div className="absolute top-[131.95px] left-[242.2px] flex flex-row items-center gap-6">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#f1aba5]" />
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#f1aba5]" />
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#f1aba5]" />
              </div>

              {/* Lucia */}
              <div className="absolute top-[25.53px] left-[381.75px] w-[183.5px] h-[220px] flex items-center justify-center">
                <div className="absolute rounded-[50%] bg-mediumblue w-[170.4px] h-[170.4px]" />
                <Image
                  className="relative z-10 w-full h-full object-contain"
                  width={182}
                  height={220}
                  alt="Lucia"
                  src="/lucia-section.png"
                />
              </div>
              {/* Texto de Lucia centrado */}
              <div className="absolute top-[257.16px] left-[381.75px] w-[183.5px] text-center">
                <b className="text-xl leading-[13px] text-indigo-700">
                  Lucia
                </b>
              </div>

              {/* Puntos conectores derechos */}
              <div className="absolute top-[131.95px] left-[582.2px] flex flex-row items-center gap-6">
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#bdb0ff]" />
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#bdb0ff]" />
                <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#bdb0ff]" />
              </div>

              {/* WhatsApp - Mantenemos el diseño original */}
              <Image
                className="absolute top-[0.41px] left-[704.91px] w-[293px] h-[251px] object-cover"
                width={293}
                height={251}
                alt="WhatsApp"
                src="/request/whats.png"
              />
              <div className="absolute top-[234px] left-[715.25px] w-[260px] h-[62px]">
                <div className="absolute top-[0px] left-[26px] rounded bg-white w-[234px] h-[62px]" />
                <Image
                  className="absolute top-[5px] left-[0px] rounded-[50%] w-[52px] h-[52px] object-cover"
                  width={52}
                  height={52}
                  alt="Avatar"
                  src="/request/avatar.png"
                />
                <div className="absolute top-[14px] left-[calc(50%_-_68px)] text-base leading-[10px] font-semibold text-[#462bdd]">
                  Cliente
                </div>
                <div className="absolute top-[15px] left-[calc(50%_+_18px)] leading-[10px] text-mediumslateblue">
                  2 min
                </div>
                <div className="absolute top-[34px] left-[calc(50%_-_66px)] leading-[10px] text-darkslategray-300">
                  <span>En espera | </span>
                  <b className="text-[#462bdd]">15 Nov</b>
                </div>
              </div>

              {/* Texto adicional */}
              <div className="absolute top-[266.53px] left-[calc(50%_-_450.7px)] text-base leading-[10px] font-semibold text-darkslategray-300 text-center">
                Cita agendada
              </div>
            </div>
          </div>
        </div>

        {/* NOTA FINAL */}
        <div className="self-stretch flex flex-col items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg text-darkslategray-100">
          <div className="w-full max-w-[1094px] tracking-[-0.02em] font-semibold text-center">
            <p className="m-0">¿Listo para empezar? Solicita tu demo personalizada</p>
          </div>
          <div className="mt-6 sm:mt-8">
            <button className="h-10 sm:h-12 md:h-14 lg:h-16 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 lg:py-5 bg-indigo-700 rounded-[60px] shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] flex justify-center items-center gap-3 sm:gap-4 md:gap-5 hover:bg-indigo-800 transition-colors">
              <span className="text-center text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold">
                Solicitar Demo
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestPage
