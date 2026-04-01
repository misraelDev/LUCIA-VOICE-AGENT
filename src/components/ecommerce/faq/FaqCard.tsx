import React from "react"
import { cn } from "@/lib/utils"

interface FaqCardProps {
  children: React.ReactNode
  className?: string
}

const FaqCard: React.FC<FaqCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "border border-[#462bdd]/20 bg-white p-6 shadow-sm transition-colors hover:border-[#462bdd]/40 md:p-8",
        className
      )}
    >
      {children}
    </div>
  )
}

export default FaqCard
