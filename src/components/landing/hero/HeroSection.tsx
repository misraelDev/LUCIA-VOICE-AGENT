"use client";
import type React from "react";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Columna 1: Texto (6 columnas) */}
            <div className="md:col-span-6 flex flex-col justify-center">
              <div className="flex flex-col gap-6">
                {/* Texto principal */}
                <div className="w-full">
                  <h1 className="text-[#462bdd] text-[50px] font-bold leading-[65px]">
                    Tu agente de
                    <span className="block">atención 24/7.</span>
                  </h1>
                </div>

                {/* Subtítulo */}
                <div className="w-full">
                  <p className="text-[#303030] text-[28px] font-semibold leading-[49px]">
                    <span className="font-bold">Responde, agenda y fideliza clientes</span>
                  </p>
                </div>

                {/* Descripción */}
                <div className="w-full">
                  <p className="text-[#272d4e] text-2xl font-normal leading-9">
                    Haz crecer tu negocio de forma inteligente, generando valor para tu marca y reduciendo costos.
                  </p>
                </div>
              </div>
            </div>

            {/* Columna 2: Imagen (6 columnas) */}
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative w-full max-w-[650px]">
                <Image
                  src="/lucia-human.png"
                  alt="Lucia - Agente de atención 24/7"
                  width={635}
                  height={810}
                  className="w-full h-auto object-contain rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
