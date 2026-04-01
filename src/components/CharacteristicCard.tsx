"use client"

import type React from "react"
import Image from "next/image"

interface CaracteristicCardProps {
  gradient: string
  title: string
  subtitle: string
  features: Array<{ text: string; highlight?: string; subtext?: string }>
  imageSrc: string
  imagePosition: "left" | "right"
}

const CaracteristicCard: React.FC<CaracteristicCardProps> = ({ 
  gradient, 
  title, 
  subtitle, 
  features, 
  imageSrc, 
  imagePosition 
}) => {
  const imageClasses = imagePosition === "right" 
    ? "absolute bottom-0 right-0 z-50 transform translate-x-[30%] translate-y-[20%]"
    : "absolute bottom-0 left-0 z-50 transform -translate-x-[30%] translate-y-[20%]"

  return (
    <div className={`${gradient} text-white rounded-2xl p-5 sm:p-7 md:p-10 relative overflow-visible min-h-[300px] md:min-h-[280px]`}>
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">
          <span className="text-white">{title}</span>
        </h3>
        <p className="text-lg sm:text-xl md:text-2xl font-bold mb-4 md:mb-6">{subtitle}</p>

        <ul className="space-y-3 md:space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <div className="mr-3 mt-1 flex-shrink-0">
                <Image
                  src="/checkmark-circle.svg"
                  alt="Checkmark"
                  width={16}
                  height={16}
                  className="text-white"
                />
              </div>
              <div>
                <p className="font-medium text-sm md:text-base leading-tight">
                  {feature.text} {feature.highlight && <span className="font-bold">{feature.highlight}</span>}
                </p>
                {feature.subtext && (
                  <p className="font-bold text-sm md:text-base">{feature.subtext}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className={imageClasses}>
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36">
          <Image
            src={imageSrc}
            alt="Chat interface de Lucia"
            width={300}
            height={300}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export default CaracteristicCard