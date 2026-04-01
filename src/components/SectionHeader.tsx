type SectionHeaderProps = {
  subtitle: string
  title: string
  titleHighlight?: string
  boldText?: string
  description?: React.ReactNode
  titleLayout?: 'separate' | 'same-line'
  align?: 'left' | 'center'
}

export default function SectionHeader({
  subtitle,
  title,
  titleHighlight,
  boldText,
  description,
  titleLayout = 'separate',
  align = 'center'
}: SectionHeaderProps) {
  return (
    <div className={`${align === 'left' ? 'text-left' : 'text-center'} mb-6 sm:mb-8 md:mb-10`}>
      <p 
        className={`mb-3 font-semibold ${align === 'left' ? 'text-left' : 'text-center'}`}
        style={{ fontSize: '16px', color: '#3758F9' }}
      >
        {subtitle}
      </p>

      <h1 
        className={`font-bold leading-tight tracking-tight text-[#303030] mb-4 sm:mb-6 text-[40px] lg:text-[48px] ${align === 'left' ? 'text-left' : 'text-center'}`}
      >
        {title}
        {titleLayout === 'separate' ? <br /> : ' '}
        <span style={{ color: "#462BDD" }}>{titleHighlight}</span>
      </h1>

      {description && (
        <p 
          className={`leading-relaxed px-4 mt-3 mb-[18px] text-[18px] sm:text-base md:text-lg lg:text-xl xl:text-2xl ${align === 'left' ? 'text-left' : 'text-center mx-auto'}`}
        >
          <span className="font-bold">{boldText}</span> {description}
        </p>
      )}
    </div>
  )
}