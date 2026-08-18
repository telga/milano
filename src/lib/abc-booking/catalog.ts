import { abcPost } from '@/lib/abc-booking/client'
import { decodeAbcPayload } from '@/lib/abc-booking/decode'
import type { AbcService } from '@/lib/abc-booking/types'

type RawServiceEntry = {
  duration?: number
  price?: number
  onbooking_showprice?: boolean
  index?: number
  description?: string | null
  no_everyone?: boolean
}

type ServicesResponse = {
  services?: string
}

function serviceId(categoryKey: string, name: string, index: number): string {
  return `${categoryKey}::${name}::${index}`
}

export async function fetchAbcCatalog(): Promise<AbcService[]> {
  const data = await abcPost<ServicesResponse>({ services_crypt: 'demo' })
  if (!data.services) return []

  const raw = decodeAbcPayload<Record<string, Record<string, RawServiceEntry | string>>>(
    data.services,
  )

  const items: AbcService[] = []

  for (const [categoryKey, categoryData] of Object.entries(raw)) {
    if (!categoryData || typeof categoryData !== 'object') continue

    const init = typeof categoryData.init === 'string' ? categoryData.init : undefined

    for (const [name, entry] of Object.entries(categoryData)) {
      if (name === 'init' || typeof entry !== 'object' || entry === null) continue

      const index = entry.index ?? 0
      items.push({
        id: serviceId(categoryKey, name, index),
        category: formatCategoryLabel(categoryKey),
        categoryKey,
        name: formatServiceName(name),
        originalName: name,
        init,
        noEveryone: Boolean(entry.no_everyone),
        price: entry.price ?? null,
        durationMinutes: entry.duration ? Math.round(entry.duration) : null,
        showPrice: Boolean(entry.onbooking_showprice),
        index,
      })
    }
  }

  return items.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
}

function formatCategoryLabel(key: string): string {
  return key
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function formatServiceName(key: string): string {
  return key
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function parseAbcServiceId(id: string): {
  categoryKey: string
  name: string
  index: number
} | null {
  const parts = id.split('::')
  if (parts.length !== 3) return null
  const index = Number(parts[2])
  if (Number.isNaN(index)) return null
  return { categoryKey: parts[0], name: parts[1], index }
}
