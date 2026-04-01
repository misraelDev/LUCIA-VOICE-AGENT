import React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type FaqCardProps = {
	children: React.ReactNode
	className?: string
}

export default function FaqCard({ children, className = "" }: FaqCardProps) {
	return (
		<Card
			className={cn(
				"border border-[#462bdd]/20 bg-white shadow-sm hover:border-[#462bdd]/40 rounded-[5px] overflow-hidden",
				className
			)}
		>
			{children}
		</Card>
	)
}

type FaqTextProps = {
  children: React.ReactNode
  className?: string
}

export function FaqCardTitle({ children, className = "" }: FaqTextProps) {
  return (
    <span className={cn("text-base font-semibold leading-6 text-[#303030]", className)}>
      {children}
    </span>
  )
}

export function FaqCardContent({ children, className = "" }: FaqTextProps) {
  return (
    <p className={cn("text-base leading-6 text-[#303030]", className)}>
      {children}
    </p>
  )
}


