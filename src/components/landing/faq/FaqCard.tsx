// FaqCard.tsx
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
        "border border-[#462bdd]/20 bg-white shadow-sm transition-colors hover:border-[#462bdd]/40 rounded-[5px]",
        className
      )}
    >
      {children}
    </div>
  )
}

export default FaqCard