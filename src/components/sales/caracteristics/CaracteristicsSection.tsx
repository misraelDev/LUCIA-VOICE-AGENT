"use client";

import React, { useEffect, useRef, useState } from "react";
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

// CONFIGURACIÓN DE DATOS ESPECÍFICA PARA SALES
const CHARACTERISTICS_CONFIG = {
  canales: {
    title: "Atención Multilingüe 24/7",
    description: (
      <>
        <span className="font-semibold">Atiende llamadas y mensajes en cualquier momento.</span> Acelera la atención de los clientes con mayor probabilidad de cierre.
      </>
    ),
    footer:
      "LucIA aumenta la tasa de cierre y mantiene un seguimiento constante. También filtra contactos no viables, ahorrando tiempo al equipo.",
    type: "cards_with_header",
    content: [
      {
        gradient: "gradient-blue",
        title: "LucIA, conversando natural y fluidamente con tus clientes",
        subtitle: "",
        features: [
          { text: "Información de campañas" },
          { text: "Resuelve consultas sobre productos/servicios" },
          { text: "Califica prospectos automáticamente" },
          { text: "Guía el proceso de compra" },
        ],
        imageSrc: "/hotels/phone.png",
        imagePosition: "left",
      },
      {
        gradient: "gradient-green",
        title: "LucIA, responde por Whatsapp o email a tus clientes",
        subtitle: "",
        features: [
          { text: "Presentar ofertas y promociones personalizadas" },
          { text: "Comparte fichas o detalles del producto/servicio" },
          { text: "Ofrecer upselling o cross-selling" },
        ],
        imageSrc: "/hotels/message.png",
        imagePosition: "right",
      },
    ],
  },
  calificacion: {
    title: "Prospección Automática de Leads",
    description: (
      <>
        <span className="font-semibold">LucIA llama de forma proactiva a base de datos</span> para presentar ofertas, detectar intento y generar oportunidades.
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/sales/sales1.png",
      clientBackground: "/scale/Ellipse39.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/sales/sales3.png",
      advisorBackground: "/sales/sales2.png",
      clientText: "Cliente interesado en un producto/servicio",
      luciaText: "LucIA llama",
      advisorText: "Oferta personalizada",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
  escalamiento: {
    title: "Creando sinergias con tu equipo de closers",
    description: (
      <>
        <span className="font-semibold">LucIA detecta y diferencia el tipo de leads</span> comunicando solo los prospectos más calientes a tu equipo para maximizar el cierre de la venta.
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/sales/sales4.png",
      clientBackground: "/hotels/2EC6E6.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/sales/sales5.png",
      advisorBackground: "/hotels/075E54.svg",
      clientText: "Cliente solicita o consulta algo particular",
      luciaText: "LucIA deriva",
      advisorText: "Equipo de venta especializado",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
  seguimiento: {
    title: "Seguimiento y Recordatorios Automatizados",
    description: (
      <>
        <span className="font-semibold">LucIA recontacta leads que no respondieron, recuerda promociones y genera urgencia.</span>
      </>
    ),
    footer: "",
    type: "central_diagram",
    content: {
      clientImage: "/sales/sales6.png",
      clientBackground: "/hotels/2EC6E6.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/sales/sales7.png",
      advisorBackground: "/sales/sales2.png",
      clientText: "Intento realizado",
      luciaText: "LucIA notifica",
      advisorText: "Cliente realiza nueva acción de compra",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#7854F7]",
    },
  },
};

// ETIQUETAS DE LOS TABS
const TABS_LABELS = {
  canales: "Canales disponibles",
  calificacion: "Prospección automática",
  escalamiento: "Escalamiento inteligente",
  seguimiento: "Seguimiento automatizado",
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
            tabData.type === "reservation_diagram"
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