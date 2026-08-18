import {
  BOOKING_FUNNEL_STEPS,
  WEB_VITAL_NAMES,
  type MetricsEventRecord,
  type WebVitalName,
} from '@/lib/metrics/types'

export function uniqueSessions(events: MetricsEventRecord[]): number {
  const ids = new Set<string>()
  for (const event of events) {
    if (event.session) ids.add(event.session)
  }
  return ids.size
}

export function p75(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].filter((value) => Number.isFinite(value)).sort((a, b) => a - b)
  if (!sorted.length) return null
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * 0.75) - 1))
  return sorted[index] ?? null
}

export function topCounts(values: Array<string | null | undefined>, limit = 10): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>()
  for (const value of values) {
    const name = value?.trim()
    if (!name) continue
    counts.set(name, (counts.get(name) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}

export function funnelDropoff(events: MetricsEventRecord[]): Array<{
  step: string
  sessions: number
  dropoff: number
  dropoffRate: number
}> {
  const perStep = BOOKING_FUNNEL_STEPS.map((step) => {
    const sessions = new Set<string>()
    for (const event of events) {
      if (event.type === 'booking_step' && event.step === step && event.session) {
        sessions.add(event.session)
      }
    }
    return { step, sessions: sessions.size }
  })

  return perStep.map((row, index) => {
    const next = perStep[index + 1]
    const dropoff = next ? Math.max(0, row.sessions - next.sessions) : 0
    return {
      ...row,
      dropoff,
      dropoffRate: row.sessions ? dropoff / row.sessions : 0,
    }
  })
}

export function countByDay(
  events: MetricsEventRecord[],
  days: number,
  predicate: (event: MetricsEventRecord) => boolean,
): Array<{ day: string; count: number }> {
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  const keys: string[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(end)
    date.setUTCDate(end.getUTCDate() - i)
    keys.push(date.toISOString().slice(0, 10))
  }

  const counts = new Map(keys.map((day) => [day, 0]))
  for (const event of events) {
    if (!event.day || !counts.has(event.day) || !predicate(event)) continue
    counts.set(event.day, (counts.get(event.day) || 0) + 1)
  }

  return keys.map((day) => ({ day, count: counts.get(day) || 0 }))
}

export function submitOutcomes(events: MetricsEventRecord[]): {
  total: number
  ok: number
  failed: number
  disabled: number
  quota: number
  successRate: number | null
} {
  const submits = events.filter((event) => event.type === 'booking_submit')
  const ok = submits.filter((event) => event.ok === true).length
  const disabled = submits.filter((event) => event.status === 'disabled').length
  const quota = submits.filter((event) => event.status === 'quota').length
  const failed = submits.length - ok
  return {
    total: submits.length,
    ok,
    failed,
    disabled,
    quota,
    successRate: submits.length ? ok / submits.length : null,
  }
}

export function fallbackStats(events: MetricsEventRecord[]): {
  clicks: number
  forced: number
  rate: number | null
} {
  const fallbacks = events.filter((event) => event.type === 'booking_fallback')
  const clicks = fallbacks.filter((event) => event.status !== 'forced').length
  const forced = fallbacks.filter((event) => event.status === 'forced').length
  const bookingSessions = uniqueSessions(events.filter((event) => event.type === 'booking_step'))
  return {
    clicks,
    forced,
    rate: bookingSessions ? fallbacks.length / bookingSessions : null,
  }
}

export function webVitalP75(events: MetricsEventRecord[]): Record<WebVitalName, number | null> {
  const result = {} as Record<WebVitalName, number | null>
  for (const name of WEB_VITAL_NAMES) {
    const values = events
      .filter((event) => event.type === 'web_vital' && event.status === name && event.value != null)
      .map((event) => Number(event.value))
    result[name] = p75(values)
  }
  return result
}

export function trackedErrorRate(events: MetricsEventRecord[]): number | null {
  const tracked = events.filter(
    (event) =>
      event.type === 'error' ||
      event.type === 'booking_submit' ||
      event.type === 'health' ||
      event.type === 'page_view',
  )
  if (!tracked.length) return null
  const errors = events.filter((event) => event.type === 'error' || (event.type === 'health' && event.ok === false))
  return errors.length / tracked.length
}

export function distinctDeploys(events: MetricsEventRecord[]): string[] {
  return [...new Set(events.map((event) => event.deploy).filter((value): value is string => Boolean(value)))]
}

export function summarizeMetrics(events: MetricsEventRecord[], days: number) {
  const pageViews = events.filter((event) => event.type === 'page_view')
  const outcomes = submitOutcomes(events)
  return {
    days,
    visits: pageViews.length,
    uniqueSessions: uniqueSessions(pageViews.length ? pageViews : events),
    funnel: funnelDropoff(events),
    submits: outcomes,
    fallback: fallbackStats(events),
    volume: countByDay(events, days, (event) => event.type === 'booking_submit' && event.ok === true),
    services: topCounts(
      events
        .filter((event) => event.type === 'service_select' || (event.type === 'booking_submit' && event.ok))
        .map((event) => event.serviceKey),
    ),
    categories: topCounts(
      events
        .filter((event) => event.type === 'service_select' || (event.type === 'booking_submit' && event.ok))
        .map((event) => event.category),
    ),
    adminLogins: events.filter((event) => event.type === 'admin_login').length,
    adminSaves: events.filter((event) => event.type === 'admin_save').length,
    errors: events.filter((event) => event.type === 'error').length,
    deploys: distinctDeploys(events),
    errorRate: trackedErrorRate(events),
    vitals: webVitalP75(events),
    healthOk: events.filter((event) => event.type === 'health' && event.ok === true).length,
    healthFail: events.filter((event) => event.type === 'health' && event.ok === false).length,
  }
}

export type MetricsSummary = ReturnType<typeof summarizeMetrics>
