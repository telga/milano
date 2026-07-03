import { unstable_cache } from 'next/cache'

import type { SiteImageSlotId } from '@/collections/SiteImageSlots'
import { REVALIDATE_SECONDS } from '@/lib/constants'
import { getPayloadClient } from '@/lib/payload'
import type {
  BlogPost,
  GalleryItem,
  PopupAnnouncement,
  Promotion,
  Service,
  ServiceCategory,
  SiteImageSlot,
  SiteSetting,
  Specialty,
} from '@/payload-types'

const cacheOpts = { revalidate: REVALIDATE_SECONDS, tags: ['site-content'] as string[] }

export async function getSiteSettings(): Promise<SiteSetting> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return (await payload.findGlobal({ slug: 'site-settings' })) as SiteSetting
    },
    ['site-settings'],
    cacheOpts,
  )()
}

export async function getImageSlots(): Promise<SiteImageSlot[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'site-image-slots',
        limit: 50,
        sort: 'sortOrder',
        depth: 2,
      })
      return result.docs as SiteImageSlot[]
    },
    ['site-image-slots'],
    cacheOpts,
  )()
}

export async function getImageSlot(slotId: SiteImageSlotId): Promise<SiteImageSlot | undefined> {
  const slots = await getImageSlots()
  return slots.find((s) => s.slotId === slotId)
}

export async function getSlotsMap(): Promise<Record<string, SiteImageSlot | undefined>> {
  const slots = await getImageSlots()
  return Object.fromEntries(slots.map((s) => [s.slotId, s]))
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'service-categories',
        where: { published: { equals: true } },
        sort: 'sortOrder',
        limit: 100,
        depth: 0,
      })
      return result.docs as ServiceCategory[]
    },
    ['service-categories'],
    cacheOpts,
  )()
}

export async function getServices(): Promise<Service[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'services',
        where: { published: { equals: true } },
        sort: 'sortOrder',
        limit: 500,
        depth: 1,
      })
      return result.docs as Service[]
    },
    ['services'],
    cacheOpts,
  )()
}

export async function getServicesByCategory(): Promise<
  Array<{ category: ServiceCategory; services: Service[] }>
> {
  const [categories, services] = await Promise.all([getServiceCategories(), getServices()])

  return categories.map((category) => ({
    category,
    services: services.filter((service) => {
      const catId = typeof service.category === 'object' ? service.category?.id : service.category
      return catId === category.id
    }),
  }))
}

export async function getPromotions(): Promise<Promotion[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'promotions',
        where: { published: { equals: true } },
        sort: 'sortOrder',
        limit: 50,
        depth: 2,
      })
      return result.docs as Promotion[]
    },
    ['promotions'],
    cacheOpts,
  )()
}

export async function getSpecialties(): Promise<Specialty[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'specialties',
        where: { published: { equals: true } },
        sort: 'sortOrder',
        limit: 50,
        depth: 2,
      })
      return result.docs as Specialty[]
    },
    ['specialties'],
    cacheOpts,
  )()
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'gallery-items',
        where: { published: { equals: true } },
        sort: 'sortOrder',
        limit: 200,
        depth: 2,
      })
      return result.docs as GalleryItem[]
    },
    ['gallery-items'],
    cacheOpts,
  )()
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'blog-posts',
        where: { status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 50,
        depth: 2,
      })
      return result.docs as BlogPost[]
    },
    ['blog-posts'],
    cacheOpts,
  )()
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'blog-posts',
        where: {
          and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }],
        },
        limit: 1,
        depth: 2,
      })
      return (result.docs[0] as BlogPost) || null
    },
    ['blog-post', slug],
    cacheOpts,
  )()
}

export async function getActiveHomePopup(): Promise<PopupAnnouncement | null> {
  try {
    return await unstable_cache(
      async () => {
        const payload = await getPayloadClient()
        const today = new Date().toISOString().split('T')[0]

        const result = await payload.find({
          collection: 'popup-announcements',
          where: {
            and: [
              { published: { equals: true } },
              { active: { equals: true } },
              { showOnHome: { equals: true } },
            ],
          },
          sort: '-sortOrder',
          limit: 10,
          depth: 2,
        })

        const docs = result.docs as PopupAnnouncement[]

        const eligible = docs.find((doc) => {
          if (doc.startDate && doc.startDate > today) return false
          if (doc.endDate && doc.endDate < today) return false
          return true
        })

        return eligible || null
      },
      ['active-home-popup'],
      cacheOpts,
    )()
  } catch {
    return null
  }
}

export async function getSlotsMapSafe(): Promise<Record<string, SiteImageSlot | undefined>> {
  try {
    return await getSlotsMap()
  } catch {
    return {}
  }
}

export async function getSiteSettingsSafe(): Promise<SiteSetting | null> {
  try {
    return await getSiteSettings()
  } catch {
    return null
  }
}
