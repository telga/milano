import { NextResponse } from 'next/server'

import { getAvailableTimes } from '@/lib/abc-booking'
import { checkRateLimit } from '@/lib/abc-booking/rate-limit'
import { trackEvent } from '@/lib/metrics/track'

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const limit = checkRateLimit(`booking-availability:${ip}`)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const body = (await request.json()) as {
      sessionId?: string
      date?: string
      serviceIds?: string[]
      staffId?: string | null
      durationMinutes?: number
      guestCount?: number
    }

    if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const durationMinutes = Array.isArray(body.serviceIds)
      ? Math.max(15, body.serviceIds.length * 30)
      : 30

    const guestCount = Number(body.guestCount)
    const availability = await getAvailableTimes({
      dateIso: body.date,
      durationMinutes: Number(body.durationMinutes) || durationMinutes,
      guestCount: Number.isFinite(guestCount) ? guestCount : 1,
    })

    return NextResponse.json({
      ...availability,
      staffId: body.staffId ?? null,
      serviceIds: body.serviceIds ?? [],
    })
  } catch (err) {
    console.error('[booking/availability]', err)
    void trackEvent({ type: 'error', status: 'booking/availability', ok: false, path: '/api/booking/availability' })
    return NextResponse.json({ error: 'Could not load availability' }, { status: 502 })
  }
}
