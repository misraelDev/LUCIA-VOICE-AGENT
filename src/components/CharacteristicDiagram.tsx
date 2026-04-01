"use client"

import type React from "react"
import Image from "next/image"

interface CaracteristicDiagramProps {
  clientBackground: string
  luciaImage: string
  whatsappImage: string
  avatarImage: string
  clientText: string
  luciaText: string
  appointmentText: string
  confirmationText: string
  successText: string
  leftConnectorColor: string
  rightConnectorColor: string
}

const CaracteristicDiagram: React.FC<CaracteristicDiagramProps> = ({
  clientBackground,
  luciaImage,
  whatsappImage,
  avatarImage,
  clientText,
  luciaText,
  appointmentText,
  confirmationText,
  successText,
  leftConnectorColor,
  rightConnectorColor
}) => {
  return (
    <div className="w-full max-w-[1084px] flex flex-col items-center justify-center text-left text-xs text-mediumblue">
      <div className="w-full max-w-[978px] relative min-h-[450px] lg:min-h-[350px]">
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
                src={clientBackground}
              />
            </div>
            <div className="mt-3 sm:mt-4 relative flex items-center justify-center w-full max-w-[280px] px-4">
              <div className="relative bg-white rounded-lg shadow-sm p-3 w-full min-w-[240px]">
                <div className="flex items-center gap-3">
                  <Image
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                    width={48}
                    height={48}
                    alt="Avatar"
                    src={avatarImage}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm sm:text-base font-semibold text-[#462bdd] truncate">{clientText.split(' ')[0]}</span>
                      <span className="text-xs sm:text-sm text-mediumslateblue whitespace-nowrap">10:30 AM</span>
                    </div>
                    <div className="text-xs sm:text-sm text-darkslategray-300">
                      <span>{appointmentText} | </span>
                      <b className="text-[#462bdd]">15 Nov</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Puntos conectores verticales */}
          <div className="flex flex-col items-center gap-3">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${leftConnectorColor}`} />
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${leftConnectorColor}`} />
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${leftConnectorColor}`} />
          </div>

          {/* Lucia */}
          <div className="flex flex-col items-center">
            <div className="relative w-[182px] h-[220px] sm:w-[200px] sm:h-[240px] md:w-[220px] md:h-[260px] flex items-center justify-center">
              <div className="absolute rounded-[50%] bg-mediumblue w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[190px] md:h-[190px]" />
              <Image
                className="relative z-10 w-full h-full object-contain"
                width={220}
                height={260}
                alt="Lucia"
                src={luciaImage}
              />
            </div>
            <div className="mt-3 sm:mt-4 text-center h-[60px] flex items-center justify-center">
              <b className="text-lg sm:text-xl leading-[1.4] text-indigo-700 max-w-[200px]">{luciaText}</b>
            </div>
          </div>

          {/* Puntos conectores verticales */}
          <div className="flex flex-col items-center gap-3">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${rightConnectorColor}`} />
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${rightConnectorColor}`} />
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${rightConnectorColor}`} />
          </div>

          {/* WhatsApp */}
          <div className="flex flex-col items-center">
            <div className="w-[240px] sm:w-[280px] md:w-[293px]">
              <Image
                className="w-full h-auto object-cover"
                width={293}
                height={251}
                alt="WhatsApp"
                src={whatsappImage}
              />
            </div>
            <div className="mt-3 sm:mt-4 relative flex items-center justify-center w-full max-w-[280px] px-4">
              <div className="relative bg-white rounded-lg shadow-sm p-3 w-full min-w-[240px]">
                <div className="flex items-center gap-3">
                  <Image
                    className="rounded-full w-10 h-10 sm:w-12 sm:h-12 object-cover flex-shrink-0"
                    width={48}
                    height={48}
                    alt="Avatar"
                    src={avatarImage}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm sm:text-base font-semibold text-[#462bdd] truncate">{clientText.split(' ')[0]}</span>
                      <span className="text-xs sm:text-sm text-mediumslateblue whitespace-nowrap">10:30 AM</span>
                    </div>
                    <div className="text-xs sm:text-sm text-darkslategray-300">
                      <span>{confirmationText} | </span>
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
              src={clientBackground}
            />
            <div className="absolute top-[0px] left-[107.25px] w-[260px] h-[62px]">
              <div className="absolute top-[0px] left-[26px] rounded bg-white w-[234px] h-[62px]" />
              <Image
                className="absolute top-[5px] left-[0px] rounded-[50%] w-[52px] h-[52px] object-cover"
                width={52}
                height={52}
                alt="Avatar"
                src={avatarImage}
              />
              <div className="absolute top-[14px] left-[calc(50%_-_68px)] text-base leading-[10px] font-semibold text-[#462bdd]">
                {clientText.split(' ')[0]}
              </div>
              <div className="absolute top-[15px] left-[calc(50%_+_18px)] leading-[10px] text-mediumslateblue">
                10:30 AM
              </div>
              <div className="absolute top-[34px] left-[calc(50%_-_66px)] leading-[10px] text-darkslategray-300">
                <span>{appointmentText} | </span>
                <b className="text-[#462bdd]">15 Nov</b>
              </div>
            </div>
          </div>

          {/* Puntos conectores izquierdos */}
          <div className="absolute top-[108px] left-[242.2px] flex flex-row items-center gap-6">
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${leftConnectorColor}`} />
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${leftConnectorColor}`} />
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${leftConnectorColor}`} />
          </div>

          {/* Lucia */}
          <div className="absolute top-[25.53px] left-[381.75px] w-[183.5px] h-[220px] flex items-center justify-center">
            <div className="absolute rounded-[50%] bg-mediumblue w-[170.4px] h-[170.4px]" />
            <Image
              className="relative z-10 w-full h-full object-contain"
              width={182}
              height={220}
              alt="Lucia"
              src={luciaImage}
            /> 
          </div>
          <div className="absolute top-[257.16px] left-[381.75px] w-[183.5px] h-[60px] text-center flex items-center justify-center">
            <b className="text-xl leading-[1.4] text-indigo-700 max-w-[180px]">
              {luciaText}
            </b>
          </div>

          {/* Puntos conectores derechos */}
          <div className="absolute top-[108px] left-[582.2px] flex flex-row items-center gap-6">
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${rightConnectorColor}`} />
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${rightConnectorColor}`} />
            <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${rightConnectorColor}`} />
          </div>

          {/* WhatsApp - Mantenemos el diseño original */}
          <Image
            className="absolute top-[0.41px] left-[704.91px] w-[293px] h-[251px] object-cover"
            width={293}
            height={251}
            alt="WhatsApp"
            src={whatsappImage}
          />
          <div className="absolute top-[234px] left-[715.25px] w-[260px] h-[62px]">
            <div className="absolute top-[0px] left-[26px] rounded bg-white w-[234px] h-[62px]" />
            <Image
              className="absolute top-[5px] left-[0px] rounded-[50%] w-[52px] h-[52px] object-cover"
              width={52}
              height={52}
              alt="Avatar"
              src={avatarImage}
            />
            <div className="absolute top-[14px] left-[calc(50%_-_68px)] text-base leading-[10px] font-semibold text-[#462bdd]">
              {clientText.split(' ')[0]}
            </div>
            <div className="absolute top-[15px] left-[calc(50%_+_18px)] leading-[10px] text-mediumslateblue">
              10:30 AM
            </div>
            <div className="absolute top-[34px] left-[calc(50%_-_66px)] leading-[10px] text-darkslategray-300">
              <span>{confirmationText} | </span>
              <b className="text-[#462bdd]">15 Nov</b>
            </div>
          </div>

          {/* Texto adicional */}
          <div className="absolute top-[266.53px] left-[calc(50%_-_450.7px)] text-base leading-[10px] font-semibold text-darkslategray-300 text-center">
            {successText}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaracteristicDiagram