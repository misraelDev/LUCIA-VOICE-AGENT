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

// CONFIGURACIÓN DE DATOS ESPECÍFICA PARA ECOMMERCE
const CHARACTERISTICS_CONFIG = {
  canales: {
    title: "Atención Multilingüe 24/7",
    description: (
      <>
        <span className="font-semibold">Atiende consultas por voz o chat las 24 horas del día.</span> Garantiza una experiencia fluida y sin interrupciones para tus clientes, estén donde estén.
      </>
    ),
    footer: "",
    type: "cards_with_header",
    content: [
      {
        gradient: "gradient-blue",
        title: "LucIA, conversa natural y fluidamente con tus clientes",
        subtitle: "",
        features: [
          { text: "Comunicación de campañas" },
          { text: "Recomendación de productos" },
          { text: "Precios y disponibilidad de productos" },
          { text: "Ayuda en el proceso de compra" },
        ],
        imageSrc: "/hotels/phone.png",
        imagePosition: "left",
      },
      {
        gradient: "gradient-green",
        title: "LucIA, responde por WhatsApp a tus clientes.",
        subtitle: "",
        features: [
          { text: "Información de productos" },
          { text: "Promociones personalizadas" },
          { text: "Seguimiento de pedido" },
          { text: "Notificaciones sobre el proceso de compra" },
        ],
        imageSrc: "/hotels/message.png",
        imagePosition: "right",
      },
    ],
  },
  redireccion: {
    title: "Información de pedidos y devoluciones",
    description: (
      <>
        <span className="font-semibold">Tus clientes podrán consultar el estado de su compra, gestionar cambios o devoluciones al instante y sin complicaciones.</span> Una experiencia rápida, fluida y sin esperas que mejora la percepción de tu marca.
      </>
    ),
    footer: (
      <span className="font-semibold">LucIA te ayudará a incrementar la satisfacción de tus clientes, lo cual hará más fácil la fidelización y la re-compra</span>
    ),
    type: "central_diagram",
    content: {
      clientImage: "/ecommerce/ecommerce1.png",
      clientBackground: "/scale/Ellipse39.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/ecommerce/ecommerce3.png",
      advisorBackground: "/scale/Ellipse38.svg",
      clientText: "Cliente solicita el estado de su compra",
      luciaText: "LucIA gestiona y notifica",
      advisorText: "Estado del pedido u orden de compra",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#f59e0b]",
    },
  },
  estrategia: {
    title: "Aumento del ticket de compra",
    description: (
      <>
        <span className="font-semibold">LucIA se convierte en tu mejor vendedor.</span> Gracias a su capacidad para analizar en tiempo real convierte cada interacción es una oportunidad para realizar cross-selling o up-selling sin que el cliente sienta presión de venta.
      </>
    ),
    footer: (
      <span className="font-semibold">LucIA puede ayudarte a aumentar tu ticket de venta en un 10% a 30%.</span>
    ),
    type: "central_diagram",
    content: {
      clientImage: "/ecommerce/ecommerce4.png",
      clientBackground: "/ecommerce/29AAF3.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/ecommerce/ecommerce6.png",
      advisorBackground: "/scale/Ellipse38.svg",
      clientText: "Cliente solicita o consulta algo particular",
      luciaText: "LucIA ofrece",
      advisorText: "Productos relacionados, descuentos",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#f59e0b]",
    },
  },
  recomendaciones: {
    title: "Recomendaciones que venden solas",
    description: (
      <>
        <span className="font-semibold">LucIA muestra sugerencias de productos y complementos en tiempo real,</span> adaptadas al estilo y necesidades de cada cliente. Más relevancia para ellos, más ventas para ti.
      </>
    ),
    footer: (
      <span className="font-semibold">LucIA ofrece recomendaciones personalizadas según el historial de compras o la descripción de lo que busca el cliente.</span>
    ),
    type: "central_diagram",
    content: {
      clientImage: "/hotels/recomendation1.png",
      clientBackground: "/hotels/2EC6E6.svg",
      luciaImage: "/hotels/valoration2.png",
      advisorImage: "/ecommerce/ecommerce7.png",
      advisorBackground: "/scale/Ellipse38.svg",
      clientText: "Cliente busca alguna recomendación",
      luciaText: "LucIA sugiere",
      advisorText: "Productos relacionados",
      leftConnectorColor: "bg-[#2EC6E6]",
      rightConnectorColor: "bg-[#f59e0b]",
    },
  },
};

// ETIQUETAS DE LOS TABS
const TABS_LABELS = {
  canales: "Canales disponibles",
  redireccion: "Información de pedidos",
  estrategia: "Aumento de ticket",
  recomendaciones: "Recomendaciones",
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