import type { Media, SiteSetting } from '@/payload-types'

import { getSiteUrl } from '@/lib/siteUrl'

type MediaLike = Media | number | null | undefined

export type { MediaLike }

export function getMediaUrl(media: MediaLike, fallback?: string): string {
  if (!media) return fallback || '/images/placeholder.svg'
  if (typeof media === 'number') return fallback || '/images/placeholder.svg'

  if (media.cloudinaryUrl) return media.cloudinaryUrl
  if (media.cloudinary?.publicId) {
    const cloudName = media.cloudinary?.cloudName || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (cloudName) {
      return `https://res.cloudinary.com/${cloudName}/image/upload/${media.cloudinary.publicId}`
    }
  }

  if (media.url) {
    if (media.url.startsWith('/') || media.url.startsWith('http')) return media.url
    const base = getSiteUrl()
    return `${base}${media.url.startsWith('/') ? '' : '/'}${media.url}`
  }

  return fallback || '/images/placeholder.svg'
}

export function getMediaAlt(media: MediaLike, fallback = 'Milano Nail Spa'): string {
  if (!media || typeof media === 'number') return fallback
  return media.alt || fallback
}

export type SiteSettingsData = SiteSetting
