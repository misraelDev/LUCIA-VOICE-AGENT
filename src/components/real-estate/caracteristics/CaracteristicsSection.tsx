"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CharacteristicTabs,
  CharacteristicTabsList,
  CharacteristicTabsTrigger,
  CharacteristicTabsContent,
} from "@/components/CharacteristicTab";
import SectionHeader from "@/components/SectionHeader";
import CharacteristicCard from "@/components/CharacteristicCard";
import CharacteristicDiagram from "@/components/CharacteristicDiagram";
import CharacteristicCentralDiagram from "@/components/CharacteristicCentralDiagram";

// CONFIGURACIÓN DE DATOS ESPECÍFICA PARA REAL ESTATE
const CHARACTERISTICS_CONFIG = {
  canales: {
    title: "Atención Multilingüe 24/7",
    description: (
      <>
        <span className="font-semibold">LucIA atiende a tus clientes por voz y WhatsApp</span> con información clara sobre inmuebles, zonas y políticas de alquiler o venta. Cuenta con multi-idioma y acentos adaptados para que tu negocio conecte con tus clientes y se sienta más cercana.
      </>
    ),
    footer: (
      <>
        <span className="font-semibold">LucIA aumenta la tasa de cierre y mantiene vivo el contacto con el cliente.</span> {" "}
        <span className="font-semibold">También filtra contactos no viables, ahorra tiempo al equipo.</span>
      </>
    ),
    type: "cards_with_header",
    content: [
      {
        gradient: "gradient-blue",
        title: "Cuando el cliente llama o escribe. Lucia está preparada para:",
        subtitle: "",
        features: [
          { text: "Informar sobre precios y características del inmueble" },
          { text: "Enviar por WhatsApp o email fichas y fotos del inmueble." },
          { text: "Calificar prospectos automáticamente" },
          { text: "Responder de inmediato sin esperas." },
        ],
        imageSrc: "/hotels/phone.png",
        imagePosition: "left",
      },
      {
        gradient: "gradient-green",
        title: "Cuando contactamos al cliente. Lucia está capacitada para:",
        subtitle: "",
        features: [
          { text: "Notificar, reprogramar y recordar la visita agendada." },
          { text: "Enviar mensajes de confirmación con ubicación y detalles de la visita." },
          { text: "Sugerir inmuebles en base al presupuesto y preferencias del cliente." },
        ],
        imageSrc: "/hotels/message.png",
        imagePosition: "right",
      },
    ],
  },
  recomendaciones: {
    title: "Agenda automática de visitas",
    description: (
      <>
        <span className="font-semibold">Califica y prioriza leads en segundos:</span> Califica presupuesto, propiedad, ubicación y timing. {" "}
        Accede a reportes estratégicos en tiempo real, no solo entenderás tu mercado, sino que priorizarás oportunidades reales y multiplicarás tus cierres.
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/real-estate/real-estate1.png",
      clientBackground: "/scale/Ellipse39.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/real-estate/real-estate3.png",
      advisorBackground: "/real-estate/376EF9.svg",
      clientText: "Cliente busca alguna recomendación",
      luciaText: "Lucia deriva",
      advisorText: "Asesor disponible atiende al cliente",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
  
  agenda_visitas: {
    title: "Agenda y comparte valor en segundos",
    description: (
      <>
        <span className="font-semibold">Programa agenda de visitas de forma automatica</span>, comparte información y fichas de las propiedades por Whatsapp. Ten un seguimiento inteligente desde la confirmación de horarios hasta el feedback de tu cliente.
      </>
    ),
    footer: "",
    type: "single_image",
    content: {
      imageSrc: "/real-estate/real-whats.webp",
    },
  },
  conecta_propiedad: {
    title: "Conecta tu cliente con la propiedad ideal",
    description: (
      <>
        <span className="font-semibold">Recomienda de forma inteligente las propiedades</span> que mejor se ajustan al presupuesto, intereses y criterios del lead, sincronizado en tiempo real con tu stock disponible desde el CRM o ERP.
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/real-estate/11.png",
      clientBackground: "/scale/Ellipse39.svg",
      luciaImage: "/icons/1.png",
      advisorImage: "/real-estate/33.png",
      advisorBackground: "/real-estate/376EF9.svg",
      clientText: "Lead comparte preferencias",
      luciaText: "LucIA recomienda propiedades ideales",
      advisorText: "Asesor recibe coincidencias",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
  gestion_recursos: {
    title: "Matching automático",
    description: (
      <>
        <span className="font-semibold">Recopila de forma automática</span> la documentación necesaria para el alquiler o venta, junto con los datos preliminares de cada lead. Cuando el momento lo requiera, <span className="font-semibold">LucIA</span> realiza una derivación fluida a un asesor sin fricciones ni pérdidas en el proceso.
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/real-estate/111.png",
      clientBackground: "/scale/Ellipse39.svg",
      luciaImage: "/real-estate/222.png",
      advisorImage: "/real-estate/333.png",
      advisorBackground: "/real-estate/376EF9.svg",
      clientText: "Lead envía documentación y datos",
      luciaText: "LucIA valida y deriva sin fricciones",
      advisorText: "Asesor continúa el proceso",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
  
};

// ETIQUETAS DE LOS TABS
const TABS_LABELS = {
  canales: "Canales disponibles",
  recomendaciones: "Gestión de leads",
  agenda_visitas: "Agenda y visitas",
  conecta_propiedad: "Matching automático",
  gestion_recursos: "Gestión de recursos",
};

const CaracteristicsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("canales");
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

  // Renderizar contenido según el tipo
  const renderTabContent = (tabKey: string) => {
    const tabData =
      CHARACTERISTICS_CONFIG[tabKey as keyof typeof CHARACTERISTICS_CONFIG];

    return (
      <div className="w-full">
        {/* Contenido específico por tipo */}
        <div
          className={
            tabData.type === "central_diagram" ||
            tabData.type === "cards_with_header" ||
            tabData.type === "reservation_diagram" ||
            tabData.type === "single_image"
              ? ""
              : "mt-12"
          }
        >
          {tabData.type === "cards" && Array.isArray(tabData.content) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
              {tabData.content.map((card, index: number) => (
                <CharacteristicCard
                  key={index}
                  gradient={card.gradient}
                  title={card.title}
                  subtitle={card.subtitle}
                  features={card.features}
                  imageSrc={card.imageSrc}
                  imagePosition={card.imagePosition as "right" | "left"}
                />
              ))}
            </div>
          )}

          {tabData.type === "cards_with_header" &&
            Array.isArray(tabData.content) && (
              <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#462bdd] mb-4">
                    {tabData.title}
                  </h2>
                  <div className="text-lg text-[#303030] max-w-3xl mx-auto">
                    {tabData.description}
                  </div>
                </div>
                
                {/* Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
                  {tabData.content.map((card, index: number) => (
                    <CharacteristicCard
                      key={index}
                      gradient={card.gradient}
                      title={card.title}
                      subtitle={card.subtitle}
                      features={card.features}
                      imageSrc={card.imageSrc}
                      imagePosition={card.imagePosition as "right" | "left"}
                    />
                  ))}
                </div>
              </div>
            )}

          {tabData.type === "reservation_diagram" &&
            !Array.isArray(tabData.content) && (
              <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#462bdd] mb-4">
                    {tabData.title}
                  </h2>
                  <div className="text-lg text-[#303030] max-w-3xl mx-auto">
                    {tabData.description}
                  </div>
                </div>
                {/* Diagram */}
                <div className="w-full flex justify-center">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <CharacteristicDiagram {...(tabData.content as any)} />
                </div>
              </div>
            )}

          {tabData.type === "central_diagram" &&
            !Array.isArray(tabData.content) && (
              <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#462bdd] mb-4">
                    {tabData.title}
                  </h2>
                  <div className="text-lg text-[#303030] max-w-3xl mx-auto">
                    {tabData.description}
                  </div>
                </div>
                {/* Diagram */}
                <div className="w-full flex justify-center">
                  <CharacteristicCentralDiagram
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...(tabData.content as any)}
                  />
                </div>
              </div>
            )}

          {tabData.type === "single_image" &&
            !Array.isArray(tabData.content) && (
              <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-[#462bdd] mb-4">
                    {tabData.title}
                  </h2>
                  <div className="text-lg text-[#303030] max-w-3xl mx-auto">
                    {tabData.description}
                  </div>
                </div>
                {/* Single Image - Centered */}
                <div className="w-full flex justify-center">
                  <Image
                    src={(tabData.content as unknown as { imageSrc: string }).imageSrc}
                    alt={tabData.title}
                    width={800}
                    height={600}
                    priority
                  />
                </div>
              </div>
            )}
        </div>

        {/* Texto adicional debajo del contenido */}
        {tabData.footer && (
          <div className="mt-8 text-center">
            <div className="text-base md:text-lg text-[#303030] max-w-3xl mx-auto">
              {tabData.footer}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 bg-[#ffffff]" style={{ backgroundColor: '#ffffff' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-0">
          <SectionHeader 
            subtitle="CARACTERÍSTICAS"
            title="Descubre todo lo que LucIA puede resolver..."
            titleHighlight="empezando por esto."
          />

          {/* Tabs Section */}
          <div className="w-full max-w-[1200px]">
            <CharacteristicTabs 
              defaultValue="canales" 
              className="w-full"
              onValueChange={(value) => setActiveTab(value)}
            >
              {/* Tabs List - Centered with horizontal scroll when needed */}
              <div className="w-full flex justify-center">
                <div ref={tabsContainerRef} className="overflow-x-auto scrollbar-hide">
                  <CharacteristicTabsList>
                    {Object.entries(TABS_LABELS).map(([key, label]) => (
                      <CharacteristicTabsTrigger key={key} value={key}>
                        <span className="whitespace-nowrap">{label}</span>
                      </CharacteristicTabsTrigger>
                    ))}
                  </CharacteristicTabsList>
                </div>
              </div>

              {/* Panels */}
              {Object.keys(CHARACTERISTICS_CONFIG).map((key) => (
                <CharacteristicTabsContent
                  key={key}
                  value={key}
                  className=""
                >
                  {renderTabContent(key)}
                </CharacteristicTabsContent>
              ))}
            </CharacteristicTabs>
          </div>
          </div>
      </div>
    </section>
  );
};

export default CaracteristicsSection;
