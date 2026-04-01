"use client"

import React from "react"
import SectionHeader from "@/components/SectionHeader"
type HeaderConfig = React.ComponentProps<typeof SectionHeader>

interface SectionWithGridProps {
  id?: string
  backgroundClassName?: string
  containerClassName?: string
  gridClassName?: string
  header: HeaderConfig
  children: React.ReactNode
}

export const SectionWithGrid: React.FC<SectionWithGridProps> = ({
  id,
  backgroundClassName = "bg-[#ffffff]",
  containerClassName = "mx-auto max-w-[1440px] px-6 sm:px-10 md:px-14 pt-16 sm:pt-20 md:pt-24 pb-10 sm:pb-12 md:pb-14",
  gridClassName = "mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch",
  header,
  children,
}) => {
  return (
    <section id={id} className={`w-full ${backgroundClassName}`}>
      <div className={containerClassName}>
        <SectionHeader {...header} />
        <div className={gridClassName}>{children}</div>
      </div>
    </section>
  )
}

export default SectionWithGrid


