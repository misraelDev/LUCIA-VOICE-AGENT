import React from "react"

// Footer/CTA consistente para las secciones que lo necesiten
interface SectionFooterProps {
  description: string
  buttonText: string
  onButtonClick?: () => void
  poppins?: { className: string }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SectionFooter({ 
  description, 
  buttonText, 
  onButtonClick, 
  poppins, 
  className = "",
  size = "md"
}: SectionFooterProps) {
  return (
    <div className={`mx-auto max-w-3xl text-center ${className}`}>
      <p className="mb-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium">
        {description}
      </p>
      <button 
        onClick={onButtonClick}
        className={`bg-white rounded-[60px] shadow-[0px_9px_20px_-3px_rgba(120,84,247,0.33)] border-2 border-indigo-700 hover:bg-gray-50 transition-colors ${
          size === 'sm' ? 'px-5 py-2.5' : size === 'lg' ? 'px-9 py-4' : 'px-7 py-3.5'
        }`}
      >
        <span className={`${poppins?.className ?? ""} text-indigo-700 ${
          size === 'sm' ? 'text-sm sm:text-base md:text-lg' : size === 'lg' ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg md:text-xl'
        } font-semibold`}>
          {buttonText}
        </span>
      </button>
    </div>
  )
}