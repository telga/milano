import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { computeAvailableSlots, formatTimeLabel, toAbcDate } from '../../src/lib/abc-booking/slots.ts'

describe('availability slots', () => {
  it('converts ISO dates to ABC M/D/YYYY', () => {
    assert.equal(toAbcDate('2026-08-18'), '8/18/2026')
  })

  it('formats 12-hour labels', () => {
    assert.equal(formatTimeLabel(9, 0), '09:00 AM')
    assert.equal(formatTimeLabel(13, 30), '01:30 PM')
  })

  it('returns weekday slots inside shop hours', () => {
    const result = computeAvailableSlots({
      dateIso: '2026-08-18',
      now: new Date(2026, 7, 1, 8, 0, 0),
      durationMinutes: 30,
      hoursByDay: {
        3: { from: '09:00 AM', to: '07:00 PM' },
      },
      maxAppHour: 24,
    })

    assert.equal(result.open, true)
    assert.ok(result.slots.length > 0)
    assert.equal(result.slots[0]?.time, '09:00 AM')
    assert.equal(result.slots.at(-1)?.time, '06:30 PM')
  })

  it('marks holidays closed', () => {
    const result = computeAvailableSlots({
      dateIso: '2026-12-25',
      now: new Date(2026, 11, 1),
      durationMinutes: 30,
      hoursByDay: { 6: { from: '09:00 AM', to: '07:00 PM' } },
      holidays: { '12/25': 'closed' },
    })
    assert.equal(result.open, false)
    assert.equal(result.slots.length, 0)
  })

  it('blocks slots when extra guests would exceed hourly capacity', () => {
    const base = {
      dateIso: '2026-08-18',
      now: new Date(2026, 7, 1, 8, 0, 0),
      durationMinutes: 30,
      hoursByDay: {
        3: { from: '09:00 AM', to: '10:00 AM' },
      },
      maxAppHour: 2,
      shopAppointments: [{ hour: '09:00 AM', duration: 30, option: JSON.stringify({ num_cust: '1' }) }],
    }

    const oneGuest = computeAvailableSlots({ ...base, guestCount: 1 })
    const twoGuests = computeAvailableSlots({ ...base, guestCount: 2 })

    assert.ok(oneGuest.slots.some((slot) => slot.time === '09:00 AM'))
    assert.equal(
      twoGuests.slots.some((slot) => slot.time === '09:00 AM'),
      false,
    )
  })
})
