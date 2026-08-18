import { NextResponse } from 'next/server'

import { summarizeMetrics } from '@/lib/metrics/aggregate'
import { utcDay, type MetricsEventRecord } from '@/lib/metrics/types'
import { getPayloadClient } from '@/lib/payload'

function startDay(days: number): string {
  const date = new Date()
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCDate(date.getUTCDate() - (days - 1))
  return date.toISOString().slice(0, 10)
}

export async function GET(request: Request) {
  const days = new URL(request.url).searchParams.get('range') === '30' ? 30 : 7
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

  const events = result.docs as unknown as MetricsEventRecord[]
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    currentDay: utcDay(),
    ...summarizeMetrics(events, days),
  })
}
