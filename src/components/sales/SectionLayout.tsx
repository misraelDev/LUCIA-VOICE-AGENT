import React from "react"

// Layout base consistente para todas las secciones
interface SectionLayoutProps {
  children: React.ReactNode
  className?: string
  id?: string
  removeTopSpacing?: boolean
}

export function SectionLayout({ children, className = "", id, removeTopSpacing = false }: SectionLayoutProps) {
  return (
    <section className={`w-full ${className}`} id={id}>
      <div className={`mx-auto max-w-6xl px-4 ${removeTopSpacing ? 'pb-10 sm:pb-14 md:pb-16' : 'py-10 sm:py-14 md:py-16'}`}>
        {children}
      </div>
    </section>
  )
}

// Header consistente para todas las secciones
interface SectionHeaderProps {
  category: string
  title: string
  highlightedText?: string
  className?: string
}

export function SectionHeader({ category, title, highlightedText, className = "" }: SectionHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="mb-3 text-xs sm:text-sm md:text-base lg:text-xl font-semibold tracking-[0.18em]">
        {category}
      </p>
      <h2 className="text-3xl md:text-6xl font-bold leading-tight tracking-tight">
        {title}
        {highlightedText && (
          <span className="text-[#462bdd]"> {highlightedText}</span>
        )}
      </h2>
    </div>
  )
}

// CTA consistente para las secciones que lo necesiten
interface SectionCTAProps {
  description: string
  buttonText: string
  onButtonClick?: () => void
  poppins?: { className: string }
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SectionCTA({ 
  description, 
  buttonText, 
  onButtonClick, 
  poppins, 
  className = "",
  size = "md"
}: SectionCTAProps) {
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