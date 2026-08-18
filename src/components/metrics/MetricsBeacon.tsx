'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { onCLS, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

import { getBrowserSessionId, shouldSkipPath, trackClientEvent } from '@/lib/metrics/client'

function sendVital(metric: Metric) {
  trackClientEvent({
    type: 'web_vital',
    status: metric.name,
    value: metric.name === 'CLS' ? metric.value : Math.round(metric.value),
    ok: true,
  })
}

export function MetricsBeacon() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || shouldSkipPath(pathname)) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    getBrowserSessionId()
    trackClientEvent({ type: 'page_view', path: pathname })
  }, [pathname])

  useEffect(() => {
    onLCP(sendVital)
    onINP(sendVital)
    onCLS(sendVital)
    onTTFB(sendVital)
    const onError = () => {
      trackClientEvent({ type: 'error', status: 'client', path: window.location.pathname, ok: false })
    }
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onError)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onError)
    }
  }, [])

  return null
}
