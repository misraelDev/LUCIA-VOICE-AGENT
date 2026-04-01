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