import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { orderBookingCatalog } from '../../src/lib/abc-booking/map-services.ts'
import type { MergedBookingService } from '../../src/lib/abc-booking/types.ts'
import type { ServiceCategory } from '../../src/payload-types.ts'

function svc(
  category: string,
  name: string,
  index: number,
): MergedBookingService {
  return {
    id: `${category.toLowerCase()}::${name}::${index}`,
    category,
    categoryKey: category.toLowerCase(),
    name,
    originalName: name.toLowerCase(),
    noEveryone: false,
    price: 10,
    durationMinutes: 20,
    showPrice: true,
    index,
  }
}

describe('booking catalog order', () => {
  it('puts manicure before later CMS categories', () => {
    const cms = [
      { id: 1, name: 'MANICURE SERVICES', slug: 'manicure', sortOrder: 1 },
      { id: 2, name: 'PEDICURE SERVICES', slug: 'pedicure', sortOrder: 2 },
      { id: 3, name: 'ACRYLIC', slug: 'acrylic', sortOrder: 7 },
    ] as ServiceCategory[]

    const { categories } = orderBookingCatalog(
      [svc('Acrylic', 'Full Set', 1), svc('Pedicure', 'Royal', 1), svc('Manicure', 'Deluxe', 1)],
      cms,
    )

    assert.deepEqual(categories.slice(0, 3), [
      'MANICURE SERVICES',
      'PEDICURE SERVICES',
      'ACRYLIC',
    ])
  })
})
