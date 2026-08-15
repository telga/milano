import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CLASSIC_LAYOUT = process.env.NEXT_PUBLIC_CLASSIC_LAYOUT === 'true'

const CLASSIC_REDIRECTS: Record<string, string> = {
  '/about': '/#about',
  '/visit-us': '/#about',
  '/promotions': '/#promotions',
  '/specialties': '/#specialties',
  '/services': '/#services',
  '/gallery': '/#gallery',
  '/blog': '/#blog',
  '/contact': '/#contact',
}

/** Always redirect the retired Visit Us page to About. */
const ALWAYS_REDIRECTS: Record<string, string> = {
  '/visit-us': '/about',
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    )
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https: http:",
    "connect-src 'self' https:",
    "frame-src https://maps.google.com https://www.google.com",
    "frame-ancestors 'none'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)
  return response
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (CLASSIC_LAYOUT) {
    const redirectTarget = CLASSIC_REDIRECTS[pathname]

    if (redirectTarget && !pathname.startsWith('/blog/')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.hash = redirectTarget.slice(2)
      return applySecurityHeaders(NextResponse.redirect(url))
    }
  } else {
    const alwaysTarget = ALWAYS_REDIRECTS[pathname]
    if (alwaysTarget) {
      const url = request.nextUrl.clone()
      url.pathname = alwaysTarget
      url.hash = ''
      return applySecurityHeaders(NextResponse.redirect(url))
    }
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
