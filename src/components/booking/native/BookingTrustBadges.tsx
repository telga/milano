import { ShieldCheck, Sparkles, Leaf } from 'lucide-react'

const BADGES = [
  { icon: Sparkles, label: 'Premium Products' },
  { icon: ShieldCheck, label: 'Clean & Safe' },
  { icon: Leaf, label: 'Relaxing Environment' },
] as const

export function BookingTrustBadges() {
  return (
    <ul className="mt-6 space-y-3 border-t border-border pt-5">
      {BADGES.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2.5 text-xs text-muted">
          <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  )
}
