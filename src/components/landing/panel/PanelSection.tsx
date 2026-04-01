'use client'

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function PanelSection() {
  return (
    <section aria-labelledby="contacto-heading" className="w-full bg-[#F2F5FE] relative overflow-hidden">
      <div className="grid items-end lg:grid-cols-2">
        {/* Izquierda: encabezado homogéneo */}
        <div className="px-4 py-12 sm:py-16 md:py-24 lg:pl-20 lg:pr-8 xl:pl-32 xl:pr-16">
          <div className="text-left">
            <p 
              className="mb-3 font-semibold tracking-[0.18em] text-left"
              style={{ fontSize: '20px', color: '#3758F9' }}
            >
              PANEL DE CONTROL
            </p>
            <h2
              className="font-bold leading-tight tracking-tight text-[40px] lg:text-[48px] text-left"
              style={{ color: '#303030' }}
            >
              Simplemente <span style={{ color: "#462BDD" }}>tu mejor solución</span>
            </h2>
            <div className="mt-3">
              <p className="text-lg lg:text-2xl leading-relaxed text-left" style={{ color: '#303030' }}>
                <span className="font-bold">Entendemos y sabemos lo que tu negocio necesita para llegar al siguiente nivel.</span>
                <br />
                Te ofrecemos un panel visual de como se encuentra tu negocio, con opciones escalables.
              </p>
            </div>
          </div>
          <div className="mt-6 flex justify-center lg:justify-start">
            <Link href="/dashboard-info" className="w-full lg:w-auto bg-white rounded-[5px] shadow-[0px_9px_20px_-3px_rgba(70,43,221,0.33)] border-2 border-[#462bdd] hover:bg-gray-50 transition-colors inline-flex items-center justify-center px-7 py-3 text-[#462bdd] text-sm sm:text-sm md:text-base font-semibold gap-2.5">
              <span>Conoce más</span>
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        {/* Derecha: imagen pegada a bordes inferior, izquierdo y derecho */}
        <div className="relative overflow-hidden flex justify-end">
          <div className="relative w-full lg:w-[95%] xl:w-[90%] h-full" style={{ transform: 'scale(1)', transformOrigin: 'bottom right' }}>
            <Image
              src="/icons/icon18.svg"
              alt="Dashboard de Lucia Voice Agent"
              width={1500}
              height={1000}
              className="w-full h-auto object-cover object-bottom"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}