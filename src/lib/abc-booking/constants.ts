import { BOOKING_URL } from '@/lib/constants'

export const ABC_BOOKING_URL = process.env.ABC_BOOKING_URL || BOOKING_URL

export const ABC_APP_ID = new URL(ABC_BOOKING_URL).searchParams.get('appid') || 'tI8PdCO'

export function abcEndpoint(): string {
  const url = new URL(ABC_BOOKING_URL)
  return `${url.origin}${url.pathname}?appid=${ABC_APP_ID}`
}

export function isAbcSubmitEnabled(): boolean {
  return process.env.ABC_BOOKING_ENABLED === 'true'
}
