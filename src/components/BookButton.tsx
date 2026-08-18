import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { isInternalBookingHref } from '@/lib/booking'
import { cn } from '@/lib/utils'

type BookButtonProps = {
  className?: string
  variant?: 'default' | 'outline' | 'slate'
  size?: 'default' | 'sm' | 'lg'
  label?: string
  /** Resolved destination from resolveBookingHref(settings). */
  bookingHref: string
}

export function BookButton({
  className,
  variant = 'default',
  size = 'default',
  label = 'Book Now',
  bookingHref,
}: BookButtonProps) {
  const internal = isInternalBookingHref(bookingHref)

  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      {internal ? (
        <Link href={bookingHref}>{label}</Link>
      ) : (
        <Link href={bookingHref} target="_blank" rel="noopener noreferrer">
          {label}
        </Link>
      )}
    </Button>
  )
}
