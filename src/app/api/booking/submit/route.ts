import { NextResponse } from 'next/server'

import { isAbcSubmitEnabled } from '@/lib/abc-booking'
import { consumeBookingSlot, refundBookingSlot, remainingBookingsToday } from '@/lib/abc-booking/quota'
import { submitAbcAppointment } from '@/lib/abc-booking/submit'
import { getAbcBookingUrl } from '@/lib/booking'
import { checkRateLimit } from '@/lib/abc-booking/rate-limit'
import { getSiteSettingsSafe } from '@/lib/data'
import { trackEvent } from '@/lib/metrics/track'

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const limit = checkRateLimit(`booking-submit:${ip}`, 10)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const settings = await getSiteSettingsSafe()
  const fallbackUrl = getAbcBookingUrl(settings)

  if (!isAbcSubmitEnabled()) {
    void trackEvent({ type: 'booking_submit', ok: false, status: 'disabled' })
    return NextResponse.json(
      {
        error: 'Native submit is disabled. Set ABC_BOOKING_ENABLED=true to send a real test booking.',
        fallbackUrl,
        submitEnabled: false,
      },
      { status: 503 },
    )
  }

  try {
    const body = (await request.json()) as {
      serviceIds?: string[]
      staffId?: string | null
      staffName?: string | null
      date?: string
      time?: string
      name?: string
      phone?: string
      comment?: string
      guestCount?: number
    }

    if (!body.serviceIds?.length || !body.name || !body.phone || !body.date || !body.time) {
      void trackEvent({ type: 'booking_submit', ok: false, status: 'validation' })
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 })
    }

    const quota = remainingBookingsToday()
    const slot = consumeBookingSlot()
    if (!slot.ok) {
      void trackEvent({ type: 'booking_submit', ok: false, status: 'quota' })
      return NextResponse.json(
        {
          error: `Daily live-booking limit reached (${quota.limit}/day). Try again tomorrow.`,
          remaining: 0,
          limit: slot.limit,
        },
        { status: 429 },
      )
    }

    try {
      await submitAbcAppointment({
        serviceIds: body.serviceIds,
        dateIso: body.date,
        time: body.time,
        name: body.name,
        phone: body.phone,
        note: body.comment,
        staffName: body.staffName,
        guestCount: body.guestCount,
      })
      void trackEvent({
        type: 'booking_submit',
        ok: true,
        status: 'ok',
        serviceKey: body.serviceIds.join(','),
      })
    } catch (err) {
      refundBookingSlot()
      throw err
    }

    return NextResponse.json({
      ok: true,
      remaining: remainingBookingsToday().remaining,
      message: 'Appointment requested. Milano Nail Spa will confirm by SMS.',
    })
  } catch (err) {
    console.error('[booking/submit]', err)
    void trackEvent({ type: 'booking_submit', ok: false, status: 'abc_error' })
    void trackEvent({ type: 'error', status: 'booking/submit', ok: false, path: '/api/booking/submit' })
    const message = err instanceof Error ? err.message : 'Booking submission failed'
    return NextResponse.json(
      {
        error: message.startsWith('ABC') || message.includes('Phone') || message.includes('service')
          ? message
          : 'Booking submission failed',
        fallbackUrl,
      },
      { status: 502 },
    )
  }
}
