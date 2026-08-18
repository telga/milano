'use client'

import { cn } from '@/lib/utils'
import type { AvailabilitySlot, TimeBand } from '@/lib/abc-booking/types'
import { localDateIso } from '@/lib/abc-booking/slots'

type BookingDateTimeStepProps = {
  date: string | null
  time: string | null
  loading?: boolean
  open?: boolean | null
  hours?: { from: string; to: string }
  slots: AvailabilitySlot[]
  onDateChange: (date: string) => void
  onTimeChange: (slot: AvailabilitySlot) => void
}

const BANDS: Array<{ id: TimeBand; label: string }> = [
  { id: 'morning', label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening', label: 'Evening' },
]

export function BookingDateTimeStep({
  date,
  time,
  loading,
  open,
  hours,
  slots,
  onDateChange,
  onTimeChange,
}: BookingDateTimeStepProps) {
  const minDate = localDateIso()

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 03</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Date & Time</h2>
        <p className="mt-2 text-sm text-muted">Pick a day, then choose an available time.</p>
      </div>

      <div className="field max-w-xs">
        <label htmlFor="booking-date" className="field-label">
          Appointment date
        </label>
        <input
          id="booking-date"
          type="date"
          min={minDate}
          value={date ?? ''}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {!date && <p className="text-sm text-muted">Select a date to load available times.</p>}

      {date && loading && <p className="text-sm text-muted">Loading available times…</p>}

      {date && !loading && open === false && (
        <p className="text-sm text-muted">The salon is closed on this date. Please pick another day.</p>
      )}

      {date && !loading && open && hours && (
        <p className="text-xs uppercase tracking-[0.18em] text-muted">
          Open {hours.from} – {hours.to}
        </p>
      )}

      {date && !loading && open && slots.length === 0 && (
        <p className="text-sm text-muted">No remaining times this day. Try another date.</p>
      )}

      {date && !loading && slots.length > 0 && (
        <div className="space-y-6">
          {BANDS.map((band) => {
            const bandSlots = slots.filter((slot) => slot.band === band.id)
            if (!bandSlots.length) return null
            return (
              <div key={band.id}>
                <h3 className="mb-3 text-[10px] uppercase tracking-[0.24em] text-gold">{band.label}</h3>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {bandSlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => onTimeChange(slot)}
                      className={cn(
                        'luxury-card px-3 py-2 text-center text-sm',
                        time === slot.time && 'border-gold ring-1 ring-gold/30',
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
