"use client"

import Image from "next/image"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export default function PrefooterSection() {
  return (
    <div className={`w-full py-24 px-4 relative overflow-hidden ${poppins.className}`}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-footer.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Container con flex para mejor control de alineación */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-10 md:gap-8 lg:gap-12">
          
          {/* Innovación */}
          <div className="flex flex-row items-center gap-6 justify-start w-full md:w-1/3 px-2 py-4">
            <Image src="/prefooter/Innovation.svg" alt="Innovación" width={56} height={56} />
            <div className="flex flex-col text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-white">
                Innovación
              </h3>
              <p className="text-sm sm:text-base font-normal text-white leading-snug">
                Mejoramos continuamente para ofrecerte mejores soluciones
              </p>
            </div>
          </div>

          {/* Soporte y apoyo */}
          <div className="flex flex-row items-center gap-6 justify-start w-full md:w-1/3 px-2 py-4">
            <Image src="/prefooter/Support.svg" alt="Soporte" width={56} height={56} />
            <div className="flex flex-col text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-white">
                Soporte y apoyo
              </h3>
              <p className="text-sm sm:text-base font-normal text-white leading-snug">
                Soporte disponible 24/7. Con el respaldo de un equipo humano confiable.
              </p>
            </div>
          </div>

          {/* Garantía */}
          <div className="flex flex-row items-center gap-6 justify-start w-full md:w-1/3 px-2 py-4">
            <Image src="/prefooter/Garantia.svg" alt="Garantía" width={56} height={56} />
            <div className="flex flex-col text-white">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-white">
                Garantía
              </h3>
              <p className="text-sm sm:text-base font-normal text-white leading-snug">
                Devolución de dinero de 14 días.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}