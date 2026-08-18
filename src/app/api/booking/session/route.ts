import { NextResponse } from 'next/server'

import { createSession, fetchAbcEmployees } from '@/lib/abc-booking'
import { checkRateLimit } from '@/lib/abc-booking/rate-limit'

function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const limit = checkRateLimit(`booking-session:${ip}`)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } },
    )
  }

  try {
    const { crypt, staff } = await fetchAbcEmployees()
    const session = createSession(crypt)
    return NextResponse.json({ sessionId: session.id, staff })
  } catch (err) {
    console.error('[booking/session]', err)
    return NextResponse.json({ error: 'Could not start booking session' }, { status: 502 })
  }
}
