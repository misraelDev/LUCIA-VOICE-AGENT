import React from "react";
import FaqAccordion, {
  type FaqItem as FaqItemType,
} from "@/components/FaqAccordion";
import SectionHeader from "@/components/SectionHeader";

type FaqItem = FaqItemType;

const FAQS: FaqItem[] = [
  {
    q: "¿Puede Lucía integrarse con mi sistema de gestión inmobiliaria?",
    a: (
      <>
        Sí, Lucía se integra perfectamente con los principales sistemas de
        gestión inmobiliaria como MLS, CRM inmobiliario, y otras plataformas.
        Puede sincronizar inventario de propiedades, consultar disponibilidad en
        tiempo real y actualizar información de clientes automáticamente.
      </>
    ),
  },
  {
    q: "¿Puede Lucía ayudar con el proceso de agendamiento de visitas?",
    a: (
      <>
        Absolutamente. Lucía puede guiar a los clientes a través del proceso de
        agendamiento, verificar disponibilidad de horarios, coordinar con
        agentes inmobiliarios y enviar confirmaciones automáticas. También puede
        manejar reprogramaciones y cancelaciones.
      </>
    ),
  },
  {
    q: "¿Qué pasa si un cliente tiene una consulta urgente sobre una propiedad?",
    a: (
      <>
        Lucía está programada para identificar consultas urgentes como ofertas
        en tiempo limitado, propiedades que acaban de salir al mercado o
        preguntas sobre financiamiento. En estos casos, inmediatamente
        transfiere la llamada a un agente inmobiliario con toda la información
        relevante.
      </>
    ),
  },
  {
    q: "¿Cómo puede Lucía aumentar las ventas y generar más leads?",
    a: (
      <>
        Lucía puede sugerir propiedades similares, ofrecer información sobre
        nuevas propiedades en el mercado, recordar propiedades favoritas y
        promocionar ofertas especiales basándose en las preferencias del
        cliente. Esto genera más oportunidades de venta de manera natural.
      </>
    ),
  },
];

interface FaqSectionProps {
  items?: FaqItem[];
  title?: string;
  subtitle?: string;
  label?: string;
}

const FaqSection: React.FC<FaqSectionProps> = ({
  items = FAQS,
  label = "PREGUNTAS FRECUENTES",
}) => {
  const visibleItems = items.slice(0, 4);

  return (
    <section aria-labelledby="faq-heading" className="w-full bg-white">
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 md:py-24">
        {/* Soft glow backdrop */}
        <div className="pointer-events-none absolute inset-x-6 top-32 -z-10 hidden h-[520px] rounded-[36px] bg-gradient-to-b from-indigo-50 to-purple-50 blur-xl sm:block" />
        <SectionHeader
          subtitle={label}
          title="¿Preguntas sobre"
          titleHighlight="Lucía para inmobiliarias?"
          titleLayout="same-line"
          boldText="Resolvemos todas tus dudas"
          description="sobre cómo Lucía puede revolucionar la atención al cliente en tu inmobiliaria y mejorar la experiencia de tus clientes."
        />

        <FaqAccordion items={visibleItems} />
      </div>
    </section>
  );
};

export default FaqSection;
