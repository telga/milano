import { BOOKING_URL } from '@/lib/constants'
import type { SiteSetting } from '@/payload-types'

export const BOOKING_PAGE_PATH = '/book'

export function getAbcBookingUrl(settings?: SiteSetting | null): string {
  return settings?.bookingUrl || BOOKING_URL
}

export function isCustomBookingEnabled(settings?: SiteSetting | null): boolean {
  return Boolean(settings?.useCustomBookingFrontend)
}

export function isNativeBookingEnabled(settings?: SiteSetting | null): boolean {
  return Boolean(settings?.useCustomBookingFrontend && settings?.useNativeAbcBooking)
}

export function isBookingSubmitEnabled(settings?: SiteSetting | null): boolean {
  return Boolean(
    settings?.useCustomBookingFrontend &&
      settings?.useNativeAbcBooking &&
      settings?.allowBookingSubmit,
  )
}

export function isInternalBookingHref(href: string): boolean {
  return href === BOOKING_PAGE_PATH || href.startsWith(`${BOOKING_PAGE_PATH}?`)
}

/** Where site Book buttons should navigate based on admin toggle. */
export function resolveBookingHref(settings?: SiteSetting | null): string {
  if (isCustomBookingEnabled(settings)) return BOOKING_PAGE_PATH
  return getAbcBookingUrl(settings)
}
