import { cn } from '@/lib/utils'
import { BOOKING_STEPS } from '@/lib/bookingSteps'

type BookingStepBarProps = {
  className?: string
}

export function BookingStepBar({ className }: BookingStepBarProps) {
  return (
    <div className={cn('border-y border-border bg-surface', className)}>
      <div
        className="container-luxury flex gap-4 overflow-x-auto py-4 sm:grid sm:grid-cols-7 sm:gap-2 sm:overflow-visible sm:py-5"
        aria-label="Booking steps"
      >
        {BOOKING_STEPS.map((item) => (
          <div
            key={item.step}
            className="flex min-w-[7.5rem] shrink-0 flex-col items-center gap-1 text-center sm:min-w-0"
          >
            <span className="font-display text-sm tracking-normal text-gold sm:text-base">
              {item.step}
            </span>
            <span className="text-[8px] uppercase tracking-[0.16em] text-muted sm:text-[9px] sm:tracking-[0.2em]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
