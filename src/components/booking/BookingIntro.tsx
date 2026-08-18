import { Phone } from 'lucide-react'

import { BUSINESS } from '@/lib/constants'

type HourRow = {
  label: string
  value: string
}

type BookingIntroProps = {
  phone?: string
  hours?: HourRow[] | null
}

export function BookingIntro({ phone = BUSINESS.phone, hours }: BookingIntroProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm leading-relaxed text-muted">
        Complete your appointment below. After you submit, our team will confirm your booking by
        text message — the same process as booking directly through ABC Salon.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
        <a
          href={`tel:${phone.replace(/\D/g, '')}`}
          className="inline-flex items-center gap-2 text-gold transition-colors hover:text-gold-light"
        >
          <Phone className="h-4 w-4" aria-hidden />
          {phone}
        </a>
        {hours?.slice(0, 2).map((row) => (
          <span key={row.label}>
            {row.label}: {row.value}
          </span>
        ))}
      </div>
    </div>
  )
}
