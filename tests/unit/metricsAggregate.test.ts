import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { funnelDropoff, p75, submitOutcomes, topCounts } from '../../src/lib/metrics/aggregate.ts'
import type { MetricsEventRecord } from '../../src/lib/metrics/types.ts'

describe('metrics aggregate', () => {
  it('computes p75', () => {
    assert.equal(p75([]), null)
    assert.equal(p75([1, 2, 3, 4]), 3)
    assert.equal(p75([10]), 10)
  })

  it('ranks top services', () => {
    assert.deepEqual(topCounts(['Gel', 'Pedi', 'Gel', 'Gel', 'Pedi', 'Kids'], 2), [
      { name: 'Gel', count: 3 },
      { name: 'Pedi', count: 2 },
    ])
  })

  it('measures funnel drop-off by unique session', () => {
    const events: MetricsEventRecord[] = [
      { type: 'booking_step', step: 'service', session: 'a' },
      { type: 'booking_step', step: 'service', session: 'b' },
      { type: 'booking_step', step: 'staff', session: 'a' },
      { type: 'booking_step', step: 'datetime', session: 'a' },
    ]
    const funnel = funnelDropoff(events)
    assert.equal(funnel[0]?.sessions, 2)
    assert.equal(funnel[0]?.dropoff, 1)
    assert.equal(funnel[1]?.sessions, 1)
    assert.equal(funnel[2]?.sessions, 1)
    assert.equal(funnel[3]?.sessions, 0)
  })

  it('treats disabled native submit as a failed outcome', () => {
    const result = submitOutcomes([
      { type: 'booking_submit', ok: true, status: 'ok' },
      { type: 'booking_submit', ok: false, status: 'disabled' },
      { type: 'booking_submit', ok: false, status: 'abc_error' },
    ])
    assert.equal(result.total, 3)
    assert.equal(result.ok, 1)
    assert.equal(result.disabled, 1)
    assert.equal(result.successRate, 1 / 3)
  })
})
