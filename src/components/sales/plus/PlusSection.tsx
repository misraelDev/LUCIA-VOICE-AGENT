import FeatureCard from "@/components/FeatureCard"
import SectionHeader from "@/components/SectionHeader"

export default function PlusSection() {
  // Configuración del header
  const headerConfig = {
    subtitle: "CARACTERÍSTICAS",
    title: "Reactivación automática de",
    titleHighlight: "clientes con LucIA",
    boldText: "Convierte tu base de datos olvidada en ingresos reales.",
    description: "Reduce costes drásticamente y libera a tu equipo para tareas de mayor valor."
  }

  // Configuración de las tarjetas
  const featuresConfig = [
    {
      title: "Contacta de forma masiva",
      description: "Recupera clientes inactivos, reactiva oportunidades y agenda citas sin esfuerzo.",
      backgroundColor: "#E3EDDB",
      imageSrc: "/dato 1.png",
      imageAlt: "Contacta de forma masiva",
      imagePosition: "bottom-right" as const,
      colSpan: 3
    },
    {
      title: "Llama en el momento óptimo",
      description: "Multiplica la conversión frente a equipos humanos gracias a la velocidad y precisión en la materialización de los objetivos.",
      backgroundColor: "#E6E0EA",
      imageSrc: "/dato 2.png",
      imageAlt: "Llama en el momento óptimo",
      imagePosition: "center-right" as const,
      colSpan: 5
    },
    {
      title: "Realiza reintentos estratégicos",
      description: "Transforma una base de datos olvidada en una fuente inmediata de ingresos.",
      backgroundColor: "#F7E6D4",
      imageSrc: "/dato 3.png",
      imageAlt: "Realiza reintentos estratégicos",
      imagePosition: "center-right" as const,
      colSpan: 5
    },
    {
      title: "Agenda automáticamente",
      description: "Acelera el ciclo de ventas captando oportunidades que de otro modo se habrían perdido.",
      backgroundColor: "#F7F0D4",
      imageSrc: "/dato 4.png",
      imageAlt: "Agenda automáticamente",
      imagePosition: "bottom-right" as const,
      colSpan: 3
    }
  ]

  return (
    <main className="min-h-screen bg-white py-10 sm:py-14 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <SectionHeader {...headerConfig} />
         
        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-8 lg:gap-6">
          {featuresConfig.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              backgroundColor={feature.backgroundColor}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
              imagePosition={feature.imagePosition}
              colSpan={feature.colSpan}
            />
          ))}
        </div>
      </div>
    </main>
  )
}


