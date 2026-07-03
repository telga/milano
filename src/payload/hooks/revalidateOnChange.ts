import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

const REVALIDATE_COLLECTIONS = new Set([
  'site-image-slots',
  'service-categories',
  'services',
  'promotions',
  'specialties',
  'gallery-items',
  'blog-posts',
  'popup-announcements',
  'media',
])

const revalidate = async (tags: string[]) => {
  const secret = process.env.REVALIDATION_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  if (!secret) return

  try {
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidation-secret': secret,
      },
      body: JSON.stringify({ tags }),
    })
  } catch {
    // Non-fatal during local dev
  }
}

export const revalidateOnChange: CollectionAfterChangeHook = ({ collection, doc }) => {
  if (!REVALIDATE_COLLECTIONS.has(collection.slug)) return doc

  void revalidate(['site-content', collection.slug])
  return doc
}

export const revalidateGlobalOnChange: GlobalAfterChangeHook = ({ global }) => {
  void revalidate(['site-content', global.slug])
}
