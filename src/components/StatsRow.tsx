import { cn } from '@/lib/utils'

export const SITE_STATS = [
  { value: '100+', label: 'Premium Polishes' },
  { value: '10K+', label: 'Happy Clients' },
  { value: '5★', label: 'Client Rating' },
  { value: '100%', label: 'Satisfaction' },
]

type StatsRowProps = {
  stats?: Array<{ value: string; label: string }>
  className?: string
}

export function StatsRow({ stats = SITE_STATS, className }: StatsRowProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4', className)}>
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="font-display text-3xl text-gold sm:text-4xl md:text-5xl">{stat.value}</p>
          <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-muted sm:mt-2 sm:text-[10px] sm:tracking-[0.24em]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  )
}
