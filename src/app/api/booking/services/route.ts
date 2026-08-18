import { NextResponse } from 'next/server'

import { fetchAbcCatalog, mergeAbcWithCmsServices, orderBookingCatalog } from '@/lib/abc-booking'
import { checkRateLimit } from '@/lib/abc-booking/rate-limit'
import { getServiceCategories, getServices } from '@/lib/data'
import { trackEvent } from '@/lib/metrics/track'

function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function GET(request: Request) {
  const ip = clientIp(request)
  const limit = checkRateLimit(`booking-services:${ip}`)
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const [abcServices, cmsServices, cmsCategories] = await Promise.all([
      fetchAbcCatalog(),
      getServices(),
      getServiceCategories(),
    ])
    const merged = mergeAbcWithCmsServices(abcServices, cmsServices)
    const { services, categories } = orderBookingCatalog(merged, cmsCategories)

    return NextResponse.json({ services, categories })
  } catch (err) {
    console.error('[booking/services]', err)
    void trackEvent({ type: 'error', status: 'booking/services', ok: false, path: '/api/booking/services' })
    return NextResponse.json({ error: 'Could not load services' }, { status: 502 })
  }
}
