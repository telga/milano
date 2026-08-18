import { estimateDuration, estimateTotal, type NativeBookingState } from '@/lib/bookingFlow'
import { cn } from '@/lib/utils'

import { BookingTrustBadges } from './BookingTrustBadges'

type BookingOrderSummaryProps = {
  state: NativeBookingState
  className?: string
}

export function BookingOrderSummary({ state, className }: BookingOrderSummaryProps) {
  const selected = state.services.filter((s) => state.serviceIds.includes(s.id))
  const total = estimateTotal(state.services, state.serviceIds, state.guestCount)
  const duration = estimateDuration(state.services, state.serviceIds)

  return (
    <aside
      className={cn(
        'luxury-card flex flex-col p-5 sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]',
        className,
      )}
      aria-label="Your appointment"
    >
      <p className="eyebrow mb-1">Your Appointment</p>
      <h2 className="font-display text-lg tracking-wide text-foreground">Order Summary</h2>

      <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
        {selected.length ? (
          <ul className="space-y-3">
            {selected.map((service) => (
              <li key={service.id} className="border-b border-border pb-3 last:border-0">
                <p className="text-sm font-medium text-foreground">{service.name}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-muted">{service.category}</p>
                <div className="mt-1 flex justify-between text-xs text-muted">
                  {service.durationMinutes ? <span>{service.durationMinutes} min</span> : <span />}
                  {service.price != null ? (
                    <span className="text-gold">${service.price}+</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Select a service to begin.</p>
        )}

        {state.guestCount > 1 ? (
          <p className="text-xs text-muted">
            Clients: <span className="text-foreground">{state.guestCount}</span>
          </p>
        ) : null}

        {state.staffName ? (
          <p className="text-xs text-muted">
            Staff: <span className="text-foreground">{state.staffName}</span>
          </p>
        ) : state.staffMode === 'any' && selected.length ? (
          <p className="text-xs text-muted">Staff: Any available</p>
        ) : null}

        {state.date && state.time ? (
          <p className="text-xs text-muted">
            When:{' '}
            <span className="text-foreground">
              {state.date} · {state.time}
            </span>
          </p>
        ) : null}
      </div>

      {(total != null || duration != null) && (
        <div className="mt-4 border-t border-border pt-4">
          {duration != null && (
            <p className="text-xs text-muted">
              Est. duration: <span className="text-foreground">{duration} min</span>
            </p>
          )}
          {total != null && (
            <p className="mt-1 font-display text-xl text-gold">
              Est. ${total}
              <span className="text-sm text-muted">+</span>
            </p>
          )}
        </div>
      )}

      <BookingTrustBadges />
    </aside>
  )
}
