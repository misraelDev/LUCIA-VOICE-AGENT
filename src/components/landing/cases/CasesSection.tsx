import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  BedDouble,
  Building2,
  TrendingUp,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { useAgent } from "@/contexts/agent-context";

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
    svgSrc: string;
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

// CaseTab Component con responsive mejorado - CORREGIDO
interface CaseTabProps {
  caseItem: CaseItem;
}

const CaseTab: React.FC<CaseTabProps> = ({ caseItem }) => {
  // Usar colores del caso o valores por defecto
  const highlightColor = caseItem.highlightColor || "";
  const buttonColor = caseItem.buttonColor || "";
  const buttonHoverColor = caseItem.buttonHoverColor || "";
  const badgeColor = caseItem.badgeColor || "";
  const logoSrc = caseItem.logoSrc || "/lucia-red1.png";



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
                  className={`w-full lg:w-auto mt-6 sm:mt-8 md:mt-10 px-7 py-3 rounded-md inline-flex justify-center items-center gap-2.5 transition-colors ${buttonColor} ${buttonHoverColor}`}
                >
                  <div className="text-center justify-center text-white text-sm sm:text-sm md:text-base font-bold leading-normal">
                    Prueba un caso real
                  </div>
                  <ArrowRight className="w-5 h-5 text-white" aria-hidden="true" />
                </Link>
              );
            })()}
        </div>

        {/* Right: hero SVG with overlays - SIN ESPACIOS BLANCOS CORREGIDO */}
        <div className="relative h-56 sm:h-72 md:h-80 lg:h-96 w-full order-2 md:order-2">
          {/* Contenedor del SVG principal - CAMBIO CLAVE */}
          <div className="relative h-full w-full overflow-hidden rounded-xl border border-violet-200/70 bg-gray-50">
            <img
              src={caseItem.hero.svgSrc || "/icons/icon13.svg"}
              alt={caseItem.hero.alt}
              className="w-full h-full object-cover object-center"
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

          {/* Imagen overlay dinámica en esquina inferior izquierda - POSICIÓN MEJORADA */}
          <div className="pointer-events-none absolute bottom-0 left-0 z-50 transform translate-x-[-50%] translate-y-[10%]">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32">
              <Image
                src={logoSrc}
                alt="Imagen decorativa"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Data - Cada caso con sus propios colores personalizados
export const CASES: CaseItem[] = [
  {
    value: "hoteles",
    label: "Hoteles",
    icon: BedDouble,
    headline: "LucIA disponible para tus",
    highlight: "huéspedes las 24 horas",
    paragraphs: [
      "Atender un hotel hoy va mucho más allá de descolgar el teléfono. Implica gestionar reservas, cambios, cancelaciones, atender a huéspedes en varios idiomas, coordinar con proveedores, etc... ",
      "Tenemos la solución que buscas.",
    ],
    paragraphsHighlights: [
      { index: 0, match: "Atender un hotel hoy va mucho más allá de descolgar el teléfono." },
      { index: 1, match: "Tenemos la solución que buscas." },
    ],
    cta: "Conoce más",
    hero: {
      alt: "Pareja reservando hotel desde el sofá",
      svgSrc: "/icons/icon13.svg"
    },
    badge1: "Gestión de reservas",
    badge2: "Recomendaciones Locales",
    // Colores personalizados para hoteles (rojo EF4358)
    highlightColor: "text-[#EF4358]",
    buttonColor: "bg-[#EF4358]",
    buttonHoverColor: "hover:bg-[#d63851]",
    badgeColor: "bg-[#EF4358]",
    logoSrc: "/lucia-red1.png",
  },
  {
    value: "inmobiliarias",
    label: "Inmobiliarias",
    icon: Building2,
    headline: "LucIA atiende a tus prospectos",
    highlight: "prospectos las 24 horas",
    paragraphs: [
      "Olvídate de perder oportunidades por llamadas no atendidas o por invertir horas respondiendo lo mismo una y otra vez. LucIA, gestiona las consultas, visitas y seguimientos sin sobrecargar a tu equipo.",
    ],
    paragraphsHighlights: [
      { index: 0, match: "Olvídate de perder oportunidades por llamadas no atendidas o por invertir horas respondiendo lo mismo una y otra vez." },
    ],
    cta: "Conoce más",
    hero: {
      alt: "Agente inmobiliario mostrando propiedades",
      svgSrc: "/icons/icon14.svg"
    },
    badge1: "Agenda visitas guiadas",
    badge2: "Seguimiento de agendas",
    // Colores personalizados para inmobiliarias (azul 1C56E9)
    highlightColor: "text-[#1C56E9]",
    buttonColor: "bg-[#1C56E9]",
    buttonHoverColor: "hover:bg-[#1844c4]",
    badgeColor: "bg-[#1C56E9]",
    logoSrc: "/lucia-blue1.png",
  },
  {
    value: "ventas",
    label: "Ventas",
    icon: TrendingUp,
    headline: "LucIA impulsa tus",
    highlight: "campañas de venta 24/7",
    paragraphs: [
      "Hoy, vender es mucho más que enviar emails o hacer llamadas esporádicas. Con LucIA tu empresa estará presente en el momento justo, responderá al instante, despertando el interés real y cerrando ventas antes que tu competencia."    ],
    paragraphsHighlights: [
      { index: 0, match: "Hoy, vender es mucho más que enviar emails o hacer llamadas esporádicas." },
    ],
    cta: "Conoce más",
    hero: {
      alt: "Equipo de ventas analizando métricas",
      svgSrc: "/icons/icon15.svg"
    },
    badge1: "Genera más conversiones",
    badge2: "Escalamiento inteligente",
    // Colores personalizados para ventas (verde 469F5C)
    highlightColor: "text-[#469F5C]",
    buttonColor: "bg-[#469F5C]",
    buttonHoverColor: "hover:bg-[#3d8a4f]",
    badgeColor: "bg-[#469F5C]",
    logoSrc: "/lucia-green1.png",
  },
  {
    value: "ecommerce",
    label: "Ecommerce",
    icon: ShoppingBag,
    headline: "LucIA potencia tus ventas",
    highlight: "sin aumentas costos.",
    paragraphs: [
      "Tus clientes esperan respuestas inmediatas, recomendaciones personalizadas y un servicio postventa impecable, sin importar el canal ni la hora.",
      "Mientras tu equipo se concentra en tareas estratégicas, LucIA atiende cada interacción con precisión y calidez.",
    ],
    paragraphsHighlights: [
      { index: 0, match: "Tus clientes esperan respuestas inmediatas, recomendaciones personalizadas y un servicio postventa impecable, sin importar el canal ni la hora." },
    ],
    cta: "Conoce más",
    hero: {
      alt: "Comprador online recibiendo soporte",
      svgSrc: "/icons/icon16.svg"
    },
    badge1: "Recomendación personalizada",
    badge2: "Gestión de pedidos",
    // Colores personalizados para ecommerce (naranja F49600)
    highlightColor: "text-[#F49600]",
    buttonColor: "bg-[#F49600]",
    buttonHoverColor: "hover:bg-[#d18000]",
    badgeColor: "bg-[#F49600]",
    logoSrc: "/lucia-yellow1.png",
  },
  {
    value: "clinicas",
    label: "Clínicas",
    icon: Stethoscope,
    headline: "LucIA atiende y programa",
    highlight: "las citas de tus pacientes",
    paragraphs: [
      "Tus pacientes exigen respuestas inmediatas, atención cercana y personalizada con un seguimiento impecable, sin importar el canal ni la hora.  LucIA garantiza esa experiencia."    ],
    paragraphsHighlights: [
      { index: 0, match: "Tus pacientes exigen respuestas inmediatas, atención cercana y personalizada con un seguimiento impecable, sin importar el canal ni la hora." },
    ],
    cta: "Conoce más",
    hero: {
      alt: "Paciente agendando cita médica",
      svgSrc: "/icons/icon17.svg"
    },
    badge1: "Gestión de citas",
    badge2: "Atención inmediata 24/7",
    // Colores personalizados para clínicas (cian 38AAAA)
    highlightColor: "text-[#38AAAA]",
    buttonColor: "bg-[#38AAAA]",
    buttonHoverColor: "hover:bg-[#309999]",
    badgeColor: "bg-[#38AAAA]",
    logoSrc: "/lucia-solid1.png",
  },
];

// CasesSection con tabs responsive mejorado
interface CasesSectionProps {
  items?: CaseItem[];
  defaultValue?: string;
  sectionLabel?: string;
  titleLeft?: string;
  titleRight?: string;
  onCaseChange?: (caseItem: CaseItem) => void;
}

const CasesSection: React.FC<CasesSectionProps> = ({
  items = CASES,
  defaultValue = "hoteles",
  sectionLabel = "CASOS DE ESTUDIO",
  titleLeft = "100% adaptable",
  titleRight = "a tu negocio",
  onCaseChange,
}) => {
  const { loadModel, isLoadingModel, activeModel } = useAgent();
  const [activeTab, setActiveTab] = useState(defaultValue);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Efecto para centrar la pestaña activa solo dentro del contenedor de tabs
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeTabElement = tabsContainerRef.current.querySelector(`[data-state="active"]`) as HTMLElement;
      if (activeTabElement) {
        const container = tabsContainerRef.current;
        
        // Calcular la posición para centrar la pestaña
        const scrollLeft = activeTabElement.offsetLeft - (container.clientWidth / 2) + (activeTabElement.clientWidth / 2);
        
        // Hacer scroll suave solo dentro del contenedor de tabs
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  const handleCaseChange = async (caseItem: CaseItem) => {
    try {
      console.log(`🔄 Changing to case: ${caseItem.value} (${caseItem.label})`)
      
      // Cargar el modelo correspondiente al caso seleccionado
      await loadModel(caseItem.value);
      
      console.log(`✅ Model loaded for case: ${caseItem.value}`)
      
      // Llamar al callback original si existe
      if (onCaseChange) {
        onCaseChange(caseItem);
      }
    } catch (error) {
      console.error(`❌ Error loading model for case ${caseItem.value}:`, error)
      // Aquí podrías mostrar un toast o notificación de error
    }
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-[#ffffff]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <p
          className="mb-3 text-center font-semibold tracking-[0.18em]"
          style={{ fontSize: "16px", color: "#606060" }}
        >
          {sectionLabel}
        </p>
        <h1
          className="text-center font-bold tracking-tight"
          style={{ fontSize: "48px" }}
        >
          <span>{titleLeft} </span>
          <span style={{ color: "#462bdd" }}>{titleRight}</span>
        </h1>

        {/* Tabs */}
        <Tabs
          defaultValue={defaultValue}
          className="mt-8 sm:mt-12 md:mt-14"
          onValueChange={(value) => {
            setActiveTab(value);
            const selectedCase = items.find((item) => item.value === value);
            if (selectedCase) {
              handleCaseChange(selectedCase);
            }
          }}
        >
          {/* Tabs List - Horizontal scroll en móvil */}
          <div ref={tabsContainerRef} className="w-full overflow-x-auto scrollbar-hide pb-1">
            <TabsList className="inline-flex w-max min-w-full sm:w-full sm:flex sm:flex-wrap items-center justify-start sm:justify-center gap-1 sm:gap-2 md:gap-3 border-b bg-transparent p-0 shadow-none">
              {items.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="relative h-8 sm:h-9 md:h-10 bg-transparent hover:bg-transparent data-[state=active]:bg-transparent px-2 sm:px-3 py-1 sm:py-2 text-base font-semibold shadow-none border-0 border-l-0 border-r-0 border-t-0 border-b-4 border-transparent data-[state=active]:border-b-[#7854F7] data-[state=active]:text-[#7854F7] data-[state=active]:shadow-none focus-visible:border-0 focus-visible:ring-0 rounded-none flex-shrink-0"
                >
                  <span className="whitespace-nowrap text-base font-semibold flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {isLoadingModel && activeModel?.id === item.value && (
                      <div className="w-3 h-3 border-2 border-[#7854F7] border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Panels with full width background - moved back inside Tabs */}
          {items.map((item) => (
            <TabsContent key={item.value} value={item.value} className="">
              <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#F6F6FF]">
                <div
                  className="px-6 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-14 md:py-16"
                >
                  <CaseTab caseItem={item} />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default CasesSection;