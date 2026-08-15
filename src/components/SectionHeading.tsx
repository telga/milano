import { cn } from '@/lib/utils'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  accent?: string
  as?: 'h1' | 'h2'
  align?: 'left' | 'center'
  aside?: React.ReactNode
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  as = 'h2',
  align = 'left',
  aside,
  className,
}: SectionHeadingProps) {
  const Tag = as
  const centered = align === 'center'

  const heading = (
    <div className={cn(centered && 'text-center')}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag
        className={cn(
          'font-display text-[1.75rem] leading-[1.12] text-foreground sm:text-4xl md:text-5xl',
          eyebrow && 'mt-3 sm:mt-4',
        )}
      >
        {title}
        {accent && <span className="text-gold"> {accent}</span>}
      </Tag>
    </div>
  )

  if (!aside) return <div className={className}>{heading}</div>

  return (
    <div className={cn('flex flex-col gap-4 sm:gap-5', centered && 'items-center', className)}>
      {heading}
      <div className={cn('max-w-2xl', centered && 'text-center')}>{aside}</div>
    </div>
  )
}
