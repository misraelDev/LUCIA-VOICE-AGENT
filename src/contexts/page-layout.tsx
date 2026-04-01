"use client"

import React from "react"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
  sectionClassName?: string
  containerClassName?: string
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
  sectionClassName = "",
  containerClassName = ""
}) => {
  return (
    <div className="max-w-[1380px] mx-auto">
      <main className={`min-h-screen ${className}`}>
        <section className={`py-8 relative ${sectionClassName}`}>
          <div className={`w-full max-w-[1407px] mx-auto relative ${containerClassName}`}>
            {children}
          </div>
        </section>
      </main>
    </div>
  )
}

// Unified spacing and sizing utilities
export const layoutStyles = {
  // Spacing utilities
  spacing: {
    sectionPadding: "py-8",
    containerPadding: "px-4 md:px-0",
    columnGap: "gap-4 md:gap-8",
    smallGap: "gap-4",
    mediumGap: "gap-6",
    largeGap: "gap-10",
  },
  
  // Width utilities
  width: {
    container: "w-full max-w-[1407px] mx-auto",
    leftColumn: "w-full md:w-[621px]",
    rightColumn: "w-full md:w-[621px]", 
    fullWidth: "w-full",
    maxContent: "w-full max-w-[558px]",
    imageContainer: "w-full max-w-[500px]",
    buttonContainer: "w-full md:w-[800px]",
  },
  
  // Height utilities
  height: {
    screen: "min-h-screen",
    container: "min-h-[500px]",
    imageSmall: "h-[400px] md:h-[500px]",
    imageMedium: "h-[500px] md:h-[600px]",
    imageLarge: "h-[600px] md:h-[700px]",
    buttonHeight: "h-18",
    stepIcon: "w-12 h-12",
  },
  
  // Margin utilities
  margin: {
    sectionBottom: "-mb-16",
    topSpacing: "mt-8 md:mt-0",
    negativeTop: "-mt-[40px]",
    bottomSpacing: "mb-8",
  },
  
  // Position utilities
  position: {
    leftColumn: "md:absolute md:left-0 md:top-[164px]",
    rightColumn: "md:absolute md:right-0 md:top-[164px]",
    buttonPosition: "md:absolute md:left-0 md:top-[375px]",
    rightDecoration: "relative md:absolute right-0 top-0 md:translate-x-[150px]",
  }
}