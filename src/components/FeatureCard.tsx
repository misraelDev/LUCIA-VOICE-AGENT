import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  backgroundColor: string
  imageSrc: string
  imageAlt: string
  imagePosition: 'bottom-right' | 'center-right'
  colSpan: number
}

const FeatureCard = ({ title, description, backgroundColor, imageSrc, imageAlt, imagePosition, colSpan }: FeatureCardProps) => {
  
  // Si es un header de sección, renderizar el header
  

  // Clase para el grid column span
  const colSpanClassMap: Record<number, string> = {
    3: 'lg:col-span-3',
    5: 'lg:col-span-5'
  }
  const colSpanClass = colSpanClassMap[colSpan] || 'lg:col-span-4'

  return (
    <Card
      className={`
        p-4 sm:p-6 border-0 shadow-none 
        ${colSpanClass} 
        h-[280px] sm:h-[320px] lg:h-[340px]
        rounded-[5px] 
        overflow-hidden
        lg:relative
      `.trim()}
      style={{ backgroundColor }}
    >
      {/* Layout móvil/tablet: Flexbox con columnas */}
      <div className="flex flex-col h-full lg:hidden">
        {/* Fila 1: Contenido de texto */}
        <div className="flex-1 flex flex-col items-start">
          <h3 
            className="text-2xl sm:text-3xl lg:text-[30px] font-semibold mb-3 sm:mb-4 text-left" 
            style={{ color: "#303030" }}
          >
            {title}
          </h3>
          
          <p 
            className="leading-relaxed text-base sm:text-lg text-left" 
            style={{ color: "#303030" }}
          >
            {description}
          </p>
        </div>

        {/* Fila 2: Imagen en la esquina inferior derecha */}
        <div className="flex justify-end items-end mt-4">
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className="w-auto h-auto object-contain max-w-[120px] max-h-[120px] sm:max-w-[150px] sm:max-h-[150px]"
          />
        </div>
      </div>

      {/* Layout desktop: Posición absoluta original */}
      <div className={`
        hidden lg:flex lg:flex-col lg:h-full lg:items-start
        ${imagePosition === 'center-right' ? 'lg:pr-[340px]' : 'lg:pr-[220px]'}
      `.trim()}>
        {/* Imagen - solo visible en desktop */}
        <div className={`
          ${imagePosition === 'bottom-right' ? 'lg:absolute lg:bottom-4 lg:right-4' : 'lg:absolute lg:top-1/2 lg:right-4 lg:transform lg:-translate-y-1/2'}
        `}>
          <img 
            src={imageSrc} 
            alt={imageAlt}
            className={`w-auto h-auto object-contain ${
              imagePosition === 'center-right' 
                ? 'max-w-[313px] max-h-[313px]' 
                : 'max-w-[186px] max-h-[186px]'
            }`}
          />
        </div>

        <h3 
          className="text-2xl sm:text-3xl lg:text-[30px] font-semibold mb-3 sm:mb-4 text-left" 
          style={{ color: "#303030" }}
        >
          {title}
        </h3>
        
        <p 
          className="leading-relaxed text-base sm:text-lg text-left" 
          style={{ color: "#303030" }}
        >
          {description}
        </p>
      </div>
    </Card>
  )
}

export default FeatureCard
