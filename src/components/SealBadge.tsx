import { cn } from '@/lib/utils'

type SealBadgeProps = {
  topText?: string
  bottomText?: string
  monogram?: string
  established?: string
  className?: string
}

const SERIF = { fontFamily: 'var(--font-cormorant), Georgia, serif' } as const

export function SealBadge({
  topText = 'MILANO NAIL SPA',
  bottomText = 'FLOWER MOUND',
  monogram = 'M',
  established = 'EST. 2022',
  className,
}: SealBadgeProps) {
  return (
    <div className={cn('relative h-32 w-32 rounded-full sm:h-40 sm:w-40', className)}>
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <defs>
          {/* Glyphs grow outward from the top arc and inward from the bottom one,
              so the bottom baseline needs the larger radius to sit symmetrically. */}
          <path id="seal-arc-top" d="M 20 100 A 80 80 0 0 1 180 100" fill="none" />
          <path id="seal-arc-bottom" d="M 12 100 A 88 88 0 0 0 188 100" fill="none" />
        </defs>

        <circle cx="100" cy="100" r="97" fill="none" stroke="var(--gold)" strokeWidth="1" />

        <text fill="var(--gold)" fontSize="13.5" letterSpacing="2.6" style={SERIF}>
          <textPath href="#seal-arc-top" startOffset="50%" textAnchor="middle">
            {topText}
          </textPath>
        </text>
        <text fill="var(--gold)" fontSize="13" letterSpacing="4.7" style={SERIF}>
          <textPath href="#seal-arc-bottom" startOffset="50%" textAnchor="middle">
            {bottomText}
          </textPath>
        </text>

        <g fill="var(--gold)" opacity="0.75">
          <rect x="8.5" y="97.5" width="5" height="5" transform="rotate(45 11 100)" />
          <rect x="186.5" y="97.5" width="5" height="5" transform="rotate(45 189 100)" />
        </g>

        <text x="100" y="107" fill="var(--gold)" fontSize="64" textAnchor="middle" style={SERIF}>
          {monogram}
        </text>

        <line
          x1="79"
          y1="120"
          x2="121"
          y2="120"
          stroke="var(--gold)"
          strokeWidth="0.85"
          opacity="0.65"
        />

        <text
          x="101.5"
          y="136"
          fill="var(--gold)"
          fontSize="10"
          letterSpacing="3"
          textAnchor="middle"
          opacity="0.85"
          style={{ ...SERIF, fontFeatureSettings: '"lnum" 1' }}
        >
          {established}
        </text>
      </svg>
    </div>
  )
}
