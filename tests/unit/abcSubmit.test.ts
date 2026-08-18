import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  buildAbcAppointment,
  digitsPhone,
  toMilitaryHour,
  toRegularHour,
} from '../../src/lib/abc-booking/submit.ts'
import type { AbcService } from '../../src/lib/abc-booking/types.ts'

const sample: AbcService = {
  id: 'manicure::delux mani::5',
  category: 'Manicure',
  categoryKey: 'manicure',
  name: 'Delux Mani',
  originalName: 'delux mani',
  init: 'MANI',
  noEveryone: false,
  price: 31,
  durationMinutes: 20,
  showPrice: true,
  index: 5,
}

describe('abc submit payload', () => {
  it('converts display times the same way ABC does', () => {
    assert.equal(toMilitaryHour('09:30 AM'), '09:30')
    assert.equal(toMilitaryHour('01:00 PM'), '13:00')
    assert.equal(toRegularHour('13:00'), '01:00 PM')
  })

  it('keeps 10-digit phones', () => {
    assert.equal(digitsPhone('(214) 555-0100'), '2145550100')
  })

  it('builds an ABC appointment object', () => {
    const payload = buildAbcAppointment(
      {
        serviceIds: [sample.id],
        dateIso: '2026-08-18',
        time: '09:30 AM',
        name: 'Probe Test',
        phone: '2145550100',
        note: 'Native UI test — please cancel',
        staffName: 'Van',
        guestCount: 2,
      },
      [sample],
      {
        name: 'Milano Nail Spa Flower Mound',
        phone: '2145134800',
        address: '5801 Long Prairie Rd #680',
        city: 'Flower Mound',
        state: 'TX',
        zip: '75028',
      },
    )

    assert.equal(payload.date, '8/18/2026')
    assert.equal(payload.hour, '09:30 AM')
    assert.equal(payload.request, 'Van')
    assert.equal(payload.services[0]?.children, 'delux mani')
    assert.equal(payload.duration, 20)
    assert.equal(payload.option.num_cust, '2')
  })
})
