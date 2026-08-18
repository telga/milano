import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import {
  canContinue,
  clampGuestCount,
  estimateTotal,
  filterBookingCatalog,
  initialNativeBookingState,
  maxGuestCountForStaff,
  nativeBookingReducer,
  nextStep,
} from '../../src/lib/bookingFlow.ts'

describe('bookingFlow', () => {
  it('advances steps in order', () => {
    assert.equal(nextStep('service'), 'staff')
    assert.equal(nextStep('confirm'), null)
  })

  it('requires services before continue on service step', () => {
    assert.equal(canContinue(initialNativeBookingState), false)
    const withService = nativeBookingReducer(initialNativeBookingState, {
      type: 'TOGGLE_SERVICE',
      service: {
        id: 'a::b::1',
        name: 'Test',
        category: 'Manicure',
        price: 40,
        durationMinutes: 30,
      },
    })
    assert.equal(canContinue({ ...withService, serviceIds: ['a::b::1'] }), true)
  })

  it('estimates total from selected services', () => {
    const services = [
      { id: '1', name: 'A', category: 'X', price: 30, durationMinutes: 20 },
      { id: '2', name: 'B', category: 'X', price: 45, durationMinutes: 40 },
    ]
    assert.equal(estimateTotal(services, ['1', '2']), 75)
    assert.equal(estimateTotal(services, ['1', '2'], 2), 150)
  })

  it('keeps guest count at least 1 and within the ABC-style cap', () => {
    assert.equal(clampGuestCount(0), 1)
    assert.equal(clampGuestCount(-3), 1)
    assert.equal(clampGuestCount(2), 2)
    assert.equal(clampGuestCount(99), 20)
    assert.equal(clampGuestCount(99, 6), 6)
    assert.equal(maxGuestCountForStaff(4), 14)
    assert.equal(maxGuestCountForStaff(16), 16)
    assert.equal(maxGuestCountForStaff(0), 20)

    const bumped = nativeBookingReducer(initialNativeBookingState, {
      type: 'SET_GUEST_COUNT',
      count: 3,
    })
    assert.equal(bumped.guestCount, 3)

    const floored = nativeBookingReducer(initialNativeBookingState, {
      type: 'SET_GUEST_COUNT',
      count: 0,
    })
    assert.equal(floored.guestCount, 1)
  })

  it('filters the booking catalog by name and category', () => {
    const services = [
      { id: '1', name: 'Gel Shellac Mani', category: 'Manicure', price: 46, durationMinutes: 35 },
      { id: '2', name: 'Classic Pedi', category: 'Pedicure', displayCategory: 'Pedicure', price: 40, durationMinutes: 40 },
      { id: '3', name: 'Kids Mani', category: 'Children', price: 20, durationMinutes: 20 },
    ]
    const categories = ['Manicure', 'Pedicure', 'Children']

    const byName = filterBookingCatalog(services, categories, 'shellac')
    assert.deepEqual(
      byName.map((group) => group.category),
      ['Manicure'],
    )
    assert.equal(byName[0]?.items[0]?.name, 'Gel Shellac Mani')

    const byCategory = filterBookingCatalog(services, categories, 'pedicure')
    assert.equal(byCategory.length, 1)
    assert.equal(byCategory[0]?.category, 'Pedicure')
    assert.equal(byCategory[0]?.items.length, 1)

    const none = filterBookingCatalog(services, categories, 'gelx')
    assert.equal(none.length, 0)

    const all = filterBookingCatalog(services, categories, '  ')
    assert.equal(all.length, 3)
  })
})
