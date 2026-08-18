export const METRICS_EVENT_TYPES = [
  'page_view',
  'session',
  'booking_step',
  'booking_submit',
  'booking_fallback',
  'service_select',
  'admin_login',
  'admin_save',
  'error',
  'web_vital',
  'health',
] as const

export type MetricsEventType = (typeof METRICS_EVENT_TYPES)[number]

export const BOOKING_FUNNEL_STEPS = ['service', 'staff', 'datetime', 'details', 'confirm'] as const

export type BookingFunnelStep = (typeof BOOKING_FUNNEL_STEPS)[number]

export const WEB_VITAL_NAMES = ['LCP', 'INP', 'CLS', 'TTFB'] as const

export type WebVitalName = (typeof WEB_VITAL_NAMES)[number]

export type MetricsEventInput = {
  type: MetricsEventType
  path?: string | null
  step?: string | null
  serviceKey?: string | null
  category?: string | null
  ok?: boolean | null
  status?: string | null
  value?: number | null
  session?: string | null
}

export type MetricsEventRecord = MetricsEventInput & {
  day?: string | null
  deploy?: string | null
  createdAt?: string | null
}

export function isMetricsEventType(value: string): value is MetricsEventType {
  return (METRICS_EVENT_TYPES as readonly string[]).includes(value)
}

export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10)
}

export function currentDeploy(): string | null {
  return process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || process.env.VERCEL_DEPLOYMENT_ID || null
}
