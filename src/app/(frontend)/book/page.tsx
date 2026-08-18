import { redirect } from 'next/navigation'

import { BookingFacade } from '@/components/booking/BookingFacade'
import { BookingWizard } from '@/components/booking/native'
import { getAbcBookingUrl, isBookingSubmitEnabled, isCustomBookingEnabled, isNativeBookingEnabled } from '@/lib/booking'
import { getSiteSettingsSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Book Appointment',
  'Book your manicure, pedicure, or nail service at Milano Nail Spa Flower Mound.',
)

export default async function BookPage() {
  const settings = await getSiteSettingsSafe()

  if (!isCustomBookingEnabled(settings)) {
    redirect(getAbcBookingUrl(settings))
  }

  const abcBookingUrl = getAbcBookingUrl(settings)

  if (isNativeBookingEnabled(settings)) {
    return (
      <BookingWizard
        phone={settings?.phone || undefined}
        fallbackUrl={abcBookingUrl}
        submitEnabled={isBookingSubmitEnabled(settings)}
      />
    )
  }

  return (
    <BookingFacade
      abcBookingUrl={abcBookingUrl}
      phone={settings?.phone || undefined}
      hours={settings?.hours || undefined}
    />
  )
}
