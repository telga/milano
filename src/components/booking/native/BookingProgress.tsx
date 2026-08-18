import { cn } from '@/lib/utils'
import { NATIVE_BOOKING_STEPS, stepIndex, type NativeBookingStep } from '@/lib/bookingFlow'

type BookingProgressProps = {
  current: NativeBookingStep
}

export function BookingProgress({ current }: BookingProgressProps) {
  const currentIdx = stepIndex(current)

  return (
    <div className="border-y border-border bg-background">
      <ol
        className="container-luxury grid grid-cols-6 gap-y-4 py-4 sm:grid-cols-5 sm:gap-2 sm:py-5"
        aria-label="Booking progress"
      >
        {NATIVE_BOOKING_STEPS.map((item, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          return (
            <li
              key={item.id}
              aria-current={active ? 'step' : undefined}
              className={cn(
                'col-span-2 flex flex-col items-center gap-1.5 text-center sm:col-span-1 sm:col-start-auto',
                idx === 3 && 'col-start-2',
                active && 'text-gold',
                done && !active && 'text-foreground/80',
                !done && !active && 'text-muted',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full border font-display text-base sm:h-12 sm:w-12 sm:text-lg',
                  active && 'border-gold bg-gold/10 text-gold',
                  done && !active && 'border-gold/50 text-gold/80',
                  !done && !active && 'border-border',
                )}
              >
                {item.number}
              </span>
              <span className="max-w-[6.5rem] text-[9px] uppercase leading-tight tracking-[0.16em] sm:max-w-none sm:text-[9px] sm:tracking-[0.22em]">
                {item.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
