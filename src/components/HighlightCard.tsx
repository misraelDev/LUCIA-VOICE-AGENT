import { Card } from "@/components/ui/card"

type HighlightCardProps = {
  title: string
  cardTitle?: string
  description: React.ReactNode
  color?: string
  className?: string
}

export default function HighlightCard({ title, cardTitle, description, color = '#4d37c3', className = '' }: HighlightCardProps) {
  return (
    <Card
      className={`relative flex flex-col gap-4 border border-[#462bdd]/20 bg-white p-6 shadow-sm transition-colors hover:border-[#462bdd]/40 md:p-8 h-full ${className}`.trim()}
    >
      <div className="flex items-center gap-2">
        <span className="text-3xl sm:text-3xl lg:text-[30px] font-semibold leading-none" style={{ color }}>
          {title}
        </span>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-green-600"
        >
          <path 
            d="M12 4L20 12L18.59 13.41L13 7.83V20H11V7.83L5.41 13.41L4 12L12 4Z" 
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="min-w-0 space-y-2">
        {cardTitle && (
          <h3 
            className="font-semibold leading-snug tracking-tight"
            style={{ fontSize: '18px', color: '#303030' }}
          >
            {cardTitle}
          </h3>
        )}
        <p 
          style={{ fontSize: '16px', color: '#606060' }}
        >
          {description}
        </p>
      </div>
    </Card>
  )
}