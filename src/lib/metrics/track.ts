import { getPayloadClient } from '@/lib/payload'
import { currentDeploy, utcDay, type MetricsEventInput } from '@/lib/metrics/types'

export async function trackEvent(input: MetricsEventInput): Promise<void> {
  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'metrics-events',
      overrideAccess: true,
      data: {
        type: input.type,
        path: input.path || undefined,
        step: input.step || undefined,
        serviceKey: input.serviceKey || undefined,
        category: input.category || undefined,
        ok: input.ok ?? undefined,
        status: input.status || undefined,
        value: input.value ?? undefined,
        session: input.session || undefined,
        day: utcDay(),
        deploy: currentDeploy() || undefined,
      },
    })
  } catch {
    // Telemetry must never break the site.
  }
}
