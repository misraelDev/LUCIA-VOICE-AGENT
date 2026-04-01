import React from "react"

export type Benefit = {
	title: string
	description: React.ReactNode
	icon: React.ReactNode
}

interface BenefitCardProps {
	benefit: Benefit
}

export default function BenefitCard({ benefit }: BenefitCardProps) {
	return (
		<div className="flex h-full min-h-[220px] border border-[#462bdd]/20 bg-white p-6 shadow-sm transition-colors hover:border-[#462bdd]/40 md:min-h-[240px] md:p-8">
			<div className="flex h-full flex-col justify-between gap-4">
				<div className="flex h-10 w-10 items-center justify-center [&>svg]:h-10 [&>svg]:w-10 [&>img]:h-10 [&>img]:w-10">
					{benefit.icon}
					</div>
				<div className="flex-1 space-y-2">
					<h3 
						className="font-semibold leading-snug tracking-tight"
						style={{ fontSize: '24px', color: '#303030' }}
					>
						{benefit.title}
					</h3>
					<p 
						style={{ fontSize: '16px', color: '#606060' }}
					>
						{benefit.description}
					</p>
				</div>
			</div>
		</div>
	)
}