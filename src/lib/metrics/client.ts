import type { MetricsEventInput } from '@/lib/metrics/types'

const SKIP_PREFIXES = ['/admin', '/dev', '/api']

export function getBrowserSessionId(): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(/(?:^|; )milano_sid=([^;]+)/)
  if (match?.[1]) return match[1]
  const id = crypto.randomUUID()
  document.cookie = `milano_sid=${id}; path=/; max-age=86400; SameSite=Lax`
  return id
}

export function shouldSkipPath(path: string): boolean {
  return SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

export function trackClientEvent(input: Omit<MetricsEventInput, 'session'> & { session?: string }): void {
  if (typeof window === 'undefined') return
  const path = input.path || window.location.pathname
  if (path && shouldSkipPath(path)) return

  const payload = {
    ...input,
    path,
    session: input.session || getBrowserSessionId(),
  }

  const body = JSON.stringify(payload)
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: 'application/json' })
    navigator.sendBeacon('/api/dev/events', blob)
    return
  }

  void fetch('/api/dev/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined)
}
