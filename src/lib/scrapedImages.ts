import imageManifest from '../../scripts/image-manifest.json'

import type { GalleryItem, Media, Promotion, SiteImageSlot, Specialty } from '@/payload-types'

export type ScrapedImageEntry = {
  slot?: string
  collection?: string
  sourceUrl: string
  localPath: string
  publicPath: string
  alt: string
  sortOrder?: number
  title?: string
  cloudinaryPublicId?: string
  cloudinaryUrl?: string
}

const MANIFEST = imageManifest as ScrapedImageEntry[]

function asMedia(entry: ScrapedImageEntry, id: number): Media {
  return {
    id,
    alt: entry.alt || 'Milano Nail Spa',
    url: entry.cloudinaryUrl || entry.publicPath,
    cloudinaryPublicId: entry.cloudinaryPublicId,
    filename: entry.localPath.split('/').pop() || undefined,
    sourceUrl: entry.sourceUrl,
  }
}

export function getScrapedSlotEntry(slotId: string): ScrapedImageEntry | undefined {
  return MANIFEST.find((entry) => entry.slot === slotId)
}

export function scrapedMediaForSlot(slotId: string): Media | undefined {
  const entry = getScrapedSlotEntry(slotId)
  if (!entry) return undefined
  return asMedia(entry, 0)
}

export function withScrapedSlotImages(
  slots: Record<string, SiteImageSlot | undefined>,
): Record<string, SiteImageSlot | undefined> {
  const next = { ...slots }

  for (const entry of MANIFEST) {
    if (!entry.slot) continue
    const media = asMedia(entry, 0)
    const existing = next[entry.slot]
    if (!existing) {
      next[entry.slot] = {
        id: 0,
        slotId: entry.slot,
        label: entry.slot,
        page: '',
        image: media,
      }
      continue
    }
    if (existing.usePlaceholder) continue
    if (!existing.image || typeof existing.image === 'number' || !existing.image.url) {
      next[entry.slot] = { ...existing, image: media }
    }
  }

  return next
}

export function scrapedGalleryItems(): GalleryItem[] {
  return MANIFEST.filter((entry) => entry.collection === 'gallery-items').map((entry, index) => ({
    id: index + 1,
    image: asMedia(entry, index + 1),
    caption: entry.alt,
    category: 'legacy-import',
    sortOrder: entry.sortOrder ?? index,
    published: true,
  }))
}

export function scrapedPromotions(): Promotion[] {
  return MANIFEST.filter((entry) => entry.collection === 'promotions').map((entry, index) => ({
    id: index + 1,
    title: entry.title || 'Promotion',
    image: asMedia(entry, index + 1),
    sortOrder: entry.sortOrder ?? index,
    published: true,
  }))
}

export function scrapedSpecialties(): Specialty[] {
  return MANIFEST.filter((entry) => entry.collection === 'specialties').map((entry, index) => ({
    id: index + 1,
    title: entry.title || 'Specialty Design',
    subtitle: 'Best Nail Design For You',
    image: asMedia(entry, index + 1),
    sortOrder: entry.sortOrder ?? index,
    published: true,
  }))
}

export function hasCmsImage(image: Media | number | null | undefined): boolean {
  if (!image || typeof image === 'number') return false
  return Boolean(image.url)
}
