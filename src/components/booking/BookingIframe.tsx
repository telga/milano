'use client'

import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'

type BookingIframeProps = {
  abcBookingUrl: string
}

export function BookingIframe({ abcBookingUrl }: BookingIframeProps) {
  const [blocked, setBlocked] = useState(false)

  const handleLoad = useCallback(() => {
    setBlocked(false)
  }, [])

  const handleError = useCallback(() => {
    setBlocked(true)
  }, [])

  if (blocked) {
    return (
      <div className="flex min-h-[20rem] flex-col items-center justify-center gap-5 px-6 py-12 text-center">
        <p className="max-w-md text-sm leading-relaxed text-muted">
          The booking form could not be embedded here. You can continue on ABC Salon&apos;s secure
          booking page instead.
        </p>
        <Button asChild variant="outline">
          <a href={abcBookingUrl} target="_blank" rel="noopener noreferrer">
            Continue on ABC Salon booking
          </a>
        </Button>
      </div>
    )
  }

  return (
    <iframe
      src={abcBookingUrl}
      title="Book an appointment at Milano Nail Spa"
      className="min-h-[65vh] w-full border-0 sm:min-h-[70vh]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      onLoad={handleLoad}
      onError={handleError}
    />
  )
}
