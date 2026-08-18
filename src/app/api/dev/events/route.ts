import { NextResponse } from 'next/server'

import { checkRateLimit } from '@/lib/abc-booking/rate-limit'
import {
  BOOKING_FUNNEL_STEPS,
  WEB_VITAL_NAMES,
  isMetricsEventType,
  type MetricsEventInput,
} from '@/lib/metrics/types'
import { trackEvent } from '@/lib/metrics/track'

const MAX_BODY_BYTES = 8_000
const SESSION_RE = /^[a-zA-Z0-9-]{8,64}$/

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

function sameOrigin(request: Request): boolean {
  const host = request.headers.get('host')
  if (!host) return false
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const check = origin || referer
  if (!check) return true
  try {
    return new URL(check).host === host
  } catch {
    return false
  }
}

function clip(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined
  return trimmed.slice(0, max)
}

function sanitize(body: Record<string, unknown>): MetricsEventInput | null {
  const type = typeof body.type === 'string' ? body.type : ''
  if (!isMetricsEventType(type)) return null
  if (type === 'admin_login' || type === 'admin_save') return null

  const path = clip(body.path, 200)
  if (path && (path.startsWith('/admin') || path.startsWith('/dev') || path.startsWith('/api'))) {
    return null
  }

  const session = clip(body.session, 64)
  if (session && !SESSION_RE.test(session)) return null

  const step = clip(body.step, 40)
  if (type === 'booking_step' && step && !(BOOKING_FUNNEL_STEPS as readonly string[]).includes(step)) {
    return null
  }

  const status = clip(body.status, 40)
  if (type === 'web_vital' && status && !(WEB_VITAL_NAMES as readonly string[]).includes(status)) {
    return null
  }

  const value = typeof body.value === 'number' && Number.isFinite(body.value) ? body.value : undefined
  const ok = typeof body.ok === 'boolean' ? body.ok : undefined

  return {
    type,
    path,
    step,
    serviceKey: clip(body.serviceKey, 120),
    category: clip(body.category, 80),
    ok,
    status,
    value,
    session,
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const limit = checkRateLimit(`metrics-ingest:${ip}`, 120)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const raw = await request.text()
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const items = Array.isArray(parsed) ? parsed : [parsed]
  if (!items.length || items.length > 10) {
    return NextResponse.json({ error: 'Invalid batch' }, { status: 400 })
  }

  let stored = 0
  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    const event = sanitize(item as Record<string, unknown>)
    if (!event) continue
    await trackEvent(event)
    stored += 1
  }

  return NextResponse.json({ ok: true, stored })
}
