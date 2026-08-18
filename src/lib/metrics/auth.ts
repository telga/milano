const DEFAULT_PATH = 'dev'
const DEFAULT_USER = 'dev'

export function isDashboardEnabled(): boolean {
  return Boolean(process.env.DEV_DASHBOARD_SECRET?.trim())
}

export function getDashboardUser(): string {
  return process.env.DEV_DASHBOARD_USER?.trim() || DEFAULT_USER
}

export function getDashboardSecret(): string {
  return process.env.DEV_DASHBOARD_SECRET?.trim() || ''
}

/** Public URL segment, letters/numbers/hyphens only. */
export function getDashboardPath(): string {
  const raw = process.env.DEV_DASHBOARD_PATH?.trim() || DEFAULT_PATH
  const cleaned = raw.replace(/^\/+|\/+$/g, '').toLowerCase()
  if (!/^[a-z0-9-]{1,48}$/.test(cleaned)) return DEFAULT_PATH
  return cleaned
}

export function timingSafeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length)
  let mismatch = left.length === right.length ? 0 : 1
  for (let i = 0; i < length; i += 1) {
    mismatch |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0)
  }
  return mismatch === 0
}

export function parseBasicAuth(header: string | null): { user: string; password: string } | null {
  if (!header?.startsWith('Basic ')) return null
  try {
    const decoded = atob(header.slice(6).trim())
    const colon = decoded.indexOf(':')
    if (colon < 0) return null
    return { user: decoded.slice(0, colon), password: decoded.slice(colon + 1) }
  } catch {
    return null
  }
}

export function isAuthorizedDashboardRequest(header: string | null): boolean {
  if (!isDashboardEnabled()) return false
  const parsed = parseBasicAuth(header)
  if (!parsed) return false
  return (
    timingSafeEqual(parsed.user, getDashboardUser()) &&
    timingSafeEqual(parsed.password, getDashboardSecret())
  )
}

export function unauthorizedDashboardResponse(): Response {
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Milano dev dashboard"',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export function missingDashboardResponse(): Response {
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

export function isDashboardPagePath(pathname: string): boolean {
  const dash = getDashboardPath()
  return (
    pathname === '/dev' ||
    pathname.startsWith('/dev/') ||
    pathname === `/${dash}` ||
    pathname.startsWith(`/${dash}/`)
  )
}
