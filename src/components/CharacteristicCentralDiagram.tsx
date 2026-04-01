"use client"

import type React from "react"
import Image from "next/image"

interface CaracteristicCentralDiagramProps {
  title?: string
  description?: string
  clientImage: string
  clientBackground: string
  luciaImage: string
  advisorImage: string
  advisorBackground: string
  clientText: string
  luciaText: string
  advisorText: string
  leftConnectorColor: string
  rightConnectorColor: string
}

const CaracteristicCentralDiagram: React.FC<CaracteristicCentralDiagramProps> = ({
  title,
  description,
  clientImage,
  clientBackground,
  luciaImage,
  advisorImage,
  advisorBackground,
  clientText,
  luciaText,
  advisorText,
  leftConnectorColor,
  rightConnectorColor
}) => {
  return (
    <div className="w-full max-w-[1084px] mx-auto flex flex-col items-center justify-center">
      {/* Contenido superior responsive - Solo si se proporcionan title y description */}
      {title && description && (
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 mb-8 sm:mb-10 md:mb-12 lg:mb-8">
          <h2 className="text-[28px] font-extrabold leading-tight tracking-tight text-center mb-4 sm:mb-6 md:mb-8">
            <span className="text-[#462bdd]">{title}</span>
          </h2>
          <div className="text-center">
            <p className="text-base md:text-[20px] text-[#303030] max-w-3xl mx-auto">
              {description}
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[978px] relative min-h-[250px] lg:min-h-[350px]" style={{ transform: 'scale(0.95)', transformOrigin: 'center' }}>
        {/* Layout móvil y tablet */}
        <div className="flex flex-col lg:hidden items-center justify-center gap-3 sm:gap-4">
          {/* Cliente */}
          <div className="flex flex-col items-center">
            <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]">
              <Image
                className="absolute top-0 left-0 w-full h-full"
                width={200}
                height={200}
                alt="Cliente background"
                src={clientBackground}
              />
              <Image
                className="absolute top-[6px] left-[6px] sm:top-[8px] sm:left-[8px] w-[108px] h-[108px] sm:w-[124px] sm:h-[124px] md:w-[140px] md:h-[140px] object-cover rounded-full"
                width={176}
                height={176}
                alt="Cliente"
                src={clientImage}
              />
              <div className={`absolute bottom-[3px] left-[3px] rounded-full ${leftConnectorColor} w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] z-10`} />
              <Image
                className="absolute bottom-[12px] left-[12px] sm:bottom-[15px] sm:left-[15px] md:bottom-[18px] md:left-[18px] w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] md:w-[24px] md:h-[24px] z-20"
                width={30}
                height={30}
                alt="Icono mensaje"
                src="/scale/message.png"
              />
            </div>
            <div className="mt-1 sm:mt-2 text-center font-semibold text-xs sm:text-sm lg:text-lg w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] min-h-[30px] flex items-center justify-center text-[#303030]">
              {clientText}
            </div>
          </div>

          {/* Puntos conectores verticales */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${leftConnectorColor}`} />
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${leftConnectorColor}`} />
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${leftConnectorColor}`} />
          </div>

          {/* Lucia */}
          <div className="flex flex-col items-center">
            <div className="relative w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] md:w-[180px] md:h-[220px] flex items-center justify-center">
              <div className="absolute rounded-[50%] bg-[#462bdd] w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px]" />
              <Image
                className="relative z-10 w-full h-full object-contain"
                width={220}
                height={260}
                alt="Lucia"
                src={luciaImage}
              />
            </div>
            <div className="mt-1 sm:mt-2 text-center min-h-[30px] flex items-center justify-center">
              <div className="text-sm sm:text-base font-bold leading-[1.4] text-[#462bdd] max-w-[160px]">
                {luciaText}
              </div>
            </div>
          </div>

          {/* Puntos conectores verticales */}
          <div className="flex flex-col items-center gap-1 sm:gap-2">
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${rightConnectorColor}`} />
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${rightConnectorColor}`} />
            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${rightConnectorColor}`} />
          </div>

          {/* Asesor */}
          <div className="flex flex-col items-center">
            <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px]">
              <Image
                className="absolute top-0 left-0 w-full h-full"
                width={200}
                height={200}
                alt="Asesor background"
                src={advisorBackground}
              />
              <Image
                className="absolute top-[6px] left-[6px] sm:top-[8px] sm:left-[8px] w-[108px] h-[108px] sm:w-[124px] sm:h-[124px] md:w-[140px] md:h-[140px] object-cover rounded-full"
                width={176}
                height={176}
                alt="Agente humano"
                src={advisorImage}
              />
            </div>
            <div className="mt-1 sm:mt-2 text-center font-semibold text-xs sm:text-sm lg:text-lg w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] min-h-[30px] flex items-center justify-center text-[#303030]">
              {advisorText}
            </div>
          </div>
        </div>

        {/* Layout desktop */}
        <div className="hidden lg:flex flex-row items-center justify-between gap-4 xl:gap-6">
          {/* Cliente */}
          <div className="flex flex-col items-center">
            <div className="relative w-[200px] h-[200px] xl:w-[215px] xl:h-[216px]">
              <Image
                className="absolute top-0 left-0 w-full h-full"
                width={215}
                height={216}
                alt="Cliente background"
                src={clientBackground}
              />
              <Image
                className="absolute top-[12px] left-[12px] w-[176px] h-[176px] xl:w-[191px] xl:h-[191px] object-cover rounded-full"
                width={191}
                height={191}
                alt="Cliente"
                src={clientImage}
              />
            </div>
            <div className="mt-4 text-center font-semibold text-base sm:text-lg lg:text-lg w-full max-w-[240px] xl:max-w-[260px] h-[60px] flex items-center justify-center text-[#303030]">
              {clientText}
            </div>
          </div>

          {/* Puntos conectores izquierdos - Centrados con la imagen del cliente */}
          <div className="flex flex-row items-center gap-4 xl:gap-6 self-start" style={{ marginTop: '100px' }}>
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${leftConnectorColor}`} />
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${leftConnectorColor}`} />
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${leftConnectorColor}`} />
          </div>

          {/* Lucia */}
          <div className="flex flex-col items-center">
            <div className="relative w-[182px] h-[220px] xl:w-[200px] xl:h-[240px] flex items-center justify-center">
              <div className="absolute rounded-[50%] bg-[#462bdd] w-[160px] h-[160px] xl:w-[170px] xl:h-[170px]" />
              <Image
                className="relative z-10 w-full h-full object-contain"
                width={200}
                height={240}
                alt="Lucia"
                src={luciaImage}
              />
            </div>
            <div className="mt-4 text-center h-[60px] flex items-center justify-center">
              <div className="text-lg xl:text-xl font-bold leading-[1.4] text-[#462bdd] max-w-[200px]">
                {luciaText}
              </div>
            </div>
          </div>

          {/* Puntos conectores derechos - Centrados con la imagen del asesor */}
          <div className="flex flex-row items-center gap-4 xl:gap-6 self-start" style={{ marginTop: '100px' }}>
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${rightConnectorColor}`} />
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${rightConnectorColor}`} />
            <div className={`w-4 h-4 xl:w-5 xl:h-5 rounded-full ${rightConnectorColor}`} />
          </div>

          {/* Asesor */}
          <div className="flex flex-col items-center">
            <div className="relative w-[200px] h-[200px] xl:w-[215px] xl:h-[216px]">
              <Image
                className="absolute top-0 left-0 w-full h-full"
                width={215}
                height={216}
                alt="Asesor background"
                src={advisorBackground}
              />
              <Image
                className="absolute top-[12px] left-[12px] w-[176px] h-[176px] xl:w-[191px] xl:h-[191px] object-cover rounded-full"
                width={191}
                height={191}
                alt="Agente humano"
                src={advisorImage}
              />
            </div>
            <div className="mt-4 text-center font-semibold text-base sm:text-lg lg:text-lg w-full max-w-[240px] xl:max-w-[260px] h-[60px] flex items-center justify-center text-[#303030]">
              {advisorText}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaracteristicCentralDiagram