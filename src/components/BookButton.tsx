import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { BOOKING_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'

type BookButtonProps = {
  className?: string
  variant?: 'default' | 'outline' | 'slate'
  size?: 'default' | 'sm' | 'lg'
  label?: string
  bookingUrl?: string
}

export function BookButton({
  className,
  variant = 'default',
  size = 'default',
  label = 'Book Now',
  bookingUrl = BOOKING_URL,
}: BookButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <Link href={bookingUrl} target="_blank" rel="noopener noreferrer">
        {label}
      </Link>
    </Button>
  )
}
