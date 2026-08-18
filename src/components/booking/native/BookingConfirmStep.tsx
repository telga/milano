'use client'

import { Button } from '@/components/ui/button'
import type { NativeBookingState } from '@/lib/bookingFlow'

type BookingConfirmStepProps = {
  state: NativeBookingState
  fallbackUrl: string
  onSubmit: () => void
  onFallback?: () => void
  submitting: boolean
  submitted?: boolean
}

export function BookingConfirmStep({
  state,
  fallbackUrl,
  onSubmit,
  onFallback,
  submitting,
  submitted,
}: BookingConfirmStepProps) {
  const selected = state.services.filter((s) => state.serviceIds.includes(s.id))

  if (submitted) {
    return (
      <div className="space-y-4">
        <p className="eyebrow mb-2">Confirmed</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Request sent</h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Your appointment request is in ABC Salon. Milano Nail Spa will confirm by SMS. This
          environment allows one live test booking per day.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 05</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Review & Confirm</h2>
        <p className="mt-2 text-sm text-muted">
          Double-check your selections. Appointments are confirmed by SMS from Milano Nail Spa.
        </p>
      </div>

      <div className="luxury-card space-y-3 p-5 text-sm">
        <p>
          <span className="text-muted">Services: </span>
          {selected.map((s) => s.name).join(', ') || '—'}
        </p>
        <p>
          <span className="text-muted">Clients: </span>
          {state.guestCount}
        </p>
        <p>
          <span className="text-muted">Staff: </span>
          {state.staffName || (state.staffMode === 'any' ? 'Any available' : '—')}
        </p>
        <p>
          <span className="text-muted">When: </span>
          {state.date && state.time ? `${state.date} · ${state.time}` : '—'}
        </p>
        <p>
          <span className="text-muted">Contact: </span>
          {state.name} · {state.phone}
        </p>
        {state.comment ? (
          <p>
            <span className="text-muted">Notes: </span>
            {state.comment}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Request Appointment (1 live test / day)'}
        </Button>
        <Button asChild variant="outline">
          <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" onClick={onFallback}>
            Complete on ABC Salon instead
          </a>
        </Button>
      </div>
    </div>
  )
}
