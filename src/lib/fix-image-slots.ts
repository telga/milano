import type { Payload } from 'payload'

import { isHeroSlot } from '@/lib/image-slots'
import { SITE_IMAGE_SLOTS, SLOT_ASSIGNMENT_ORDER } from '@/collections/SiteImageSlots'

/**
 * Reassigns distinct gallery/media images to each site image slot in order.
 * Idempotent — safe to run after scrape or seed.
 */
export async function runFixImageSlots(payload: Payload) {
  const mediaResult = await payload.find({
    collection: 'media',
    limit: 500,
    sort: 'createdAt',
    depth: 0,
  })

  const mediaIds = mediaResult.docs.map((doc) => Number(doc.id))
  if (!mediaIds.length) {
    return { success: true, message: 'No media found — run seed first', slotsUpdated: 0 }
  }

  let mediaIndex = 0
  let slotsUpdated = 0

  for (const slotId of SLOT_ASSIGNMENT_ORDER) {
    const slotDef = SITE_IMAGE_SLOTS.find((s) => s.slotId === slotId)
    if (!slotDef) continue

    const existing = await payload.find({
      collection: 'site-image-slots',
      where: { slotId: { equals: slotId } },
      limit: 1,
    })

    const data: {
      slotId: string
      label: string
      page: string
      sortOrder: number
      image?: number | null
    } = {
      slotId: slotDef.slotId,
      label: slotDef.label,
      page: slotDef.page,
      sortOrder: slotDef.sortOrder,
    }

    if (isHeroSlot(slotId)) {
      data.image = null
    } else if (mediaIndex < mediaIds.length) {
      data.image = mediaIds[mediaIndex]
      mediaIndex++
    }

    if (existing.docs[0]) {
      await payload.update({ collection: 'site-image-slots', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'site-image-slots', data })
    }

    slotsUpdated++
  }

  return {
    success: true,
    slotsUpdated,
    mediaUsed: mediaIndex,
  }
}
