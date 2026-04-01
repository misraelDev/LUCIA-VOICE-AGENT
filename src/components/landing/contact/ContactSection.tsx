"use client"

import React from "react"
import Image from "next/image"
import ContactForm from "./ContactForm"

const ContactSection = () => {
  return (
    <section id="contacto" aria-labelledby="contacto-heading" className="w-full bg-[#ffffff] mt-20 md:mt-28">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14 md:py-16">
        <div className="grid items-start gap-12 md:grid-cols-2">
          {/* Izquierda: texto */}
          <div className="text-left">
            <p 
              className="mb-3 font-semibold tracking-[0.18em] text-left"
              style={{ fontSize: '20px', color: '#3758F9' }}
            >
              CONTACTANOS
            </p>
            <h2
              className="font-bold leading-tight tracking-tight text-[40px] lg:text-[48px] text-left"
              style={{ color: '#303030' }}
            >
              Podemos ayudarte a <span style={{ color: "#462BDD" }}>crecer tu negocio</span>
            </h2>
            <div className="mt-3">
              <p className="text-lg lg:text-2xl leading-relaxed text-left" style={{ color: '#303030' }}>
                Déjanos tus datos y nuestro equipo de venta se comunicará contigo para agendar una reunión y hablemos sin compromiso.
              </p>
            </div>
          </div>

          {/* Derecha: contenedor del formulario con decoraciones */}
          <div className="relative overflow-visible min-h-[500px]">
            {/* Decoración esquina superior derecha */}
            <div className="absolute top-4 -right-8 z-0">
              <Image
                src="/Dotted Shape.png"
                alt=""
                width={100}
                height={100}
                className="opacity-60"
              />
            </div>
            
            {/* Decoración esquina inferior izquierda */}
            <div className="absolute -bottom-8 -left-8 z-0 rotate-180">
              <Image
                src="/Dotted Shape.png"
                alt=""
                width={100}
                height={100}
                className="opacity-60"
              />
            </div>

            {/* Contenedor del formulario */}
            <div className="relative z-10">
              {/* Cuarto de círculo violeta en la esquina superior derecha */}
              <div className="pointer-events-none absolute -right-10 -top-10 z-0 h-28 w-28 rounded-bl-[72px] rounded-tr-[72px] bg-indigo-600" />
              {/* Patrón punteado detrás (lado derecho) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-24 z-0 h-56 w-24 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(#c4b5fd 1px, transparent 1px), linear-gradient(90deg, #c4b5fd 1px, transparent 1px)",
                  backgroundSize: "12px 12px, 12px 12px",
                  backgroundPosition: "0 0, 0 0",
                }}
              />
             
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection