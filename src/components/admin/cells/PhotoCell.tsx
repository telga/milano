import type { DefaultServerCellComponentProps, Payload } from 'payload'

import { cloudinaryDeliveryUrl } from '@/lib/cloudinary/config'

/**
 * Same reason as CategoryCell: Payload resolves upload columns in the browser and
 * leaves later rows showing “<No Photo>”. Resolve thumbnails on the server from a
 * short-lived lookup so every row shows its photo.
 */
type MediaLite = {
  url?: string | null
  filename?: string | null
  cloudinaryPublicId?: string | null
}

let cached: { at: number; media: Map<string, MediaLite> } | null = null
const CACHE_MS = 15_000

async function mediaLookup(payload: Payload) {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.media

  const { docs } = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 0,
    pagination: false,
      select: { url: true, filename: true, cloudinaryPublicId: true },
  })

  const media = new Map<string, MediaLite>(
    docs.map((doc) => [
      String(doc.id),
      {
        url: typeof doc.url === 'string' ? doc.url : null,
        filename: String(doc.filename ?? ''),
        cloudinaryPublicId:
          typeof doc.cloudinaryPublicId === 'string' ? doc.cloudinaryPublicId : null,
      },
    ]),
  )
  cached = { at: Date.now(), media }
  return media
}

export default async function PhotoCell({ cellData, payload }: DefaultServerCellComponentProps) {
  const value = cellData as MediaLite & { id?: number | string }
  const id = value && typeof value === 'object' ? value.id : (cellData as number | string | null)

  if (id === null || id === undefined || id === '') {
    return <span className="milano-cell-empty">No photo</span>
  }

  // payload may be undefined when this cell is rendered inside the media picker
  // drawer (client-side context). Degrade gracefully rather than crashing.
  if (!payload) {
    return <span className="milano-cell-empty">—</span>
  }

  const found = (await mediaLookup(payload)).get(String(id))
  const src =
    (found?.cloudinaryPublicId && cloudinaryDeliveryUrl(found.cloudinaryPublicId)) ||
    found?.url ||
    null
  const alt = found?.filename || ''

  if (!src) return <span className="milano-cell-empty">No photo</span>

  return (
    <span className="milano-photo-cell">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
    </span>
  )
}
