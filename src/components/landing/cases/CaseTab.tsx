import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CaseItem = {
  value: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  headline: string;
  highlight: string;
  paragraphs: string[];
  // Índices de párrafos que deben renderizarse en semibold
  paragraphsBold?: number[];
  // Resaltados específicos por párrafo: aplica semibold a la coincidencia
  paragraphsHighlights?: { index: number; match: string }[];
  cta?: string;
  hero: {
    alt: string;
    src: string;
  };
  badge1?: string;
  badge2?: string;
  // Colores personalizados para cada caso
  highlightColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  badgeColor?: string;
  logoSrc?: string;
};

// CaseTab Component con responsive mejorado
interface CaseTabProps {
  caseItem: CaseItem;
}

const CaseTab: React.FC<CaseTabProps> = ({ caseItem }) => {
  // Usar colores del caso o valores por defecto
  const highlightColor = caseItem.highlightColor || "";
  const badgeColor = caseItem.badgeColor || "";
  const logoSrc = caseItem.logoSrc || "/lucia-red1.png";

  const genericHeroByValue: Record<string, string> = {
    hoteles: "/image-large.jpg",
    inmobiliarias: "/image-large.jpg",
    ventas: "/image-large.jpg",
    ecommerce: "/image-large.jpg",
    clinicas: "/image-large.jpg",
  };

  const hasPlaceholder =
    !!caseItem.hero?.src && caseItem.hero.src.includes("/api/placeholder");
  const heroSrc = hasPlaceholder
    ? genericHeroByValue[caseItem.value] || "/image-large.jpg"
    : caseItem.hero?.src || "/image-large.jpg";

  return (
    <Card className="border-none bg-transparent p-4 sm:p-6 md:p-8">
      <div className="grid items-center gap-6 md:gap-8 md:grid-cols-2">
        {/* Left: copy */}
        <div className="order-1 md:order-1 max-w-[90%] mx-auto md:mx-0 md:mr-auto">
          <h2 className="font-extrabold leading-[1.2] sm:leading-[45px] tracking-[-0.02em] text-[24px] sm:text-[40px] text-[#303030]">
            {caseItem.headline}{" "}
            <span className={highlightColor}>{caseItem.highlight}</span>
          </h2>
          <div className="mt-6 sm:mt-8 md:mt-10 space-y-3 sm:space-y-4 tracking-[-0.02em] text-[18px] sm:text-xl">
            {caseItem.paragraphs.map((p, idx) => {
              const highlightConfig = caseItem.paragraphsHighlights?.find(h => h.index === idx);
              if (highlightConfig) {
                const { match } = highlightConfig;
                const pos = p.indexOf(match);
                if (pos !== -1) {
                  const before = p.slice(0, pos);
                  const matchText = p.slice(pos, pos + match.length);
                  const after = p.slice(pos + match.length);
                  return (
                    <p key={idx} className={`${caseItem.paragraphsBold?.includes(idx) ? "font-semibold" : "font-normal"} text-[#303030]`}>
                      {before}
                      <span className="font-semibold text-[#303030]">{matchText}</span>
                      {after}
                    </p>
                  );
                }
              }
              return (
                <p key={idx} className={`${caseItem.paragraphsBold?.includes(idx) ? "font-semibold" : "font-normal"} text-[#303030]`}>
                  {p}
                </p>
              );
            })}
          </div>
          {caseItem.cta &&
            (() => {
              const hrefByValue: Record<string, string> = {
                hoteles: "/hotels",
                inmobiliarias: "/real-estate",
                ventas: "/sales",
                ecommerce: "/ecommerce",
                clinicas: "/clinics",
              };
              const href = hrefByValue[caseItem.value] || "/hotels";
              return (
                <Link 
                  href={href} 
                  className={`mt-6 sm:mt-8 md:mt-10 px-7 py-3 rounded-md inline-flex justify-center items-center gap-2.5 transition-colors ${caseItem.buttonColor || 'bg-rose-500'} ${caseItem.buttonHoverColor || 'hover:bg-rose-600'}`}
                >
                  <div className="text-center justify-center text-white text-xs sm:text-sm md:text-base font-bold font-['Poppins'] leading-normal">
                    Prueba un caso real ahora
                  </div>
                  <ArrowRight className="w-5 h-5 text-white" aria-hidden="true" />
                </Link>
              );
            })()}
        </div>

        {/* Right: hero image with overlays - SIN ESPACIOS BLANCOS */}
        <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 w-full order-2 md:order-2">
          {/* Contenedor de la imagen principal - CAMBIO CLAVE */}
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-violet-200/70 bg-gray-50">
            <Image
              src={heroSrc}
              alt={caseItem.hero.alt}
              fill
              sizes="(min-width: 1024px) 640px, (min-width: 768px) 576px, (min-width: 640px) 512px, 100vw"
              className="object-cover object-center" // CAMBIO: de object-contain a object-cover
              priority
            />

            {/* Overlay gradiente opcional para mejor contraste con badges */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/10 pointer-events-none" />

            {/* Badges - responsive positioning and sizing */}
            <div className="pointer-events-none absolute bottom-2 sm:bottom-3 md:bottom-4 left-12 sm:left-16 md:left-20 z-10 flex flex-col gap-1.5 sm:gap-2 md:gap-2.5">
              {caseItem.badge1 && (
                <span className={`w-max rounded-full ${badgeColor} px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 text-sm sm:text-sm md:text-base font-semibold text-white shadow-lg backdrop-blur-sm`}>
                  {caseItem.badge1}
                </span>
              )}
              {caseItem.badge2 && (
                <span className={`w-max rounded-full ${badgeColor} px-3 sm:px-3.5 md:px-4 py-1 sm:py-1.5 text-sm sm:text-sm md:text-base font-semibold text-white shadow-lg backdrop-blur-sm`}>
                  {caseItem.badge2}
                </span>
              )}
            </div>
          </div>

          {/* Imagen overlay dinámica en esquina inferior izquierda - MEJORADA */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-50 transform translate-x-[-50%] translate-y-[10%]">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white rounded-full shadow-xl p-2">
              <Image
                src={logoSrc}
                alt="Imagen decorativa"
                fill
                className="object-contain p-1"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CaseTab;