import { headers } from 'next/headers'

import { DevDashboard } from '@/components/dev/DevDashboard'
import { summarizeMetrics } from '@/lib/metrics/aggregate'
import { trackEvent } from '@/lib/metrics/track'
import { currentDeploy, utcDay, type MetricsEventRecord } from '@/lib/metrics/types'
import { getPayloadClient } from '@/lib/payload'

export const dynamic = 'force-dynamic'

function startDay(days: number): string {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - (days - 1))
  return date.toISOString().slice(0, 10)
}

async function pingHealth() {
  try {
    const host = (await headers()).get('host')
    const proto = process.env.VERCEL ? 'https' : 'http'
    const res = await fetch(`${proto}://${host}/api/health`, { cache: 'no-store' })
    void trackEvent({ type: 'health', ok: res.ok, status: String(res.status), path: '/api/health' })
  } catch {
    void trackEvent({ type: 'health', ok: false, status: 'unreachable', path: '/api/health' })
  }
}

export default async function DevDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const params = await searchParams
  const days = params.range === '30' ? 30 : 7
  await pingHealth()

  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'metrics-events',
    overrideAccess: true,
    depth: 0,
    limit: 5000,
    sort: '-createdAt',
    where: {
      day: {
        greater_than_equal: startDay(days),
      },
    },
  })

  const summary = summarizeMetrics(result.docs as unknown as MetricsEventRecord[], days)

  return (
    <DevDashboard
      summary={summary}
      generatedAt={new Date().toISOString()}
      currentDay={utcDay()}
      deploy={currentDeploy()}
      environment={process.env.VERCEL_ENV || process.env.NODE_ENV || 'development'}
    />
  )
}
