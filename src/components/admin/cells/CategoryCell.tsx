import type { DefaultServerCellComponentProps } from 'payload'
import type { Payload } from 'payload'

/**
 * Payload resolves relationship columns in the browser, which only fills in the
 * first handful of rows on larger pages. Categories are few and change rarely,
 * so resolve the name on the server from a short-lived lookup instead.
 */
let cached: { at: number; names: Map<string, string> } | null = null
const CACHE_MS = 15_000

async function categoryNames(payload: Payload) {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.names

  const { docs } = await payload.find({
    collection: 'service-categories',
    depth: 0,
    limit: 0,
    pagination: false,
  })

  const names = new Map(docs.map((doc) => [String(doc.id), doc.name]))
  cached = { at: Date.now(), names }
  return names
}

export default async function CategoryCell({ cellData, payload }: DefaultServerCellComponentProps) {
  const id =
    cellData && typeof cellData === 'object' && 'id' in cellData
      ? (cellData as { id: number | string }).id
      : cellData

  if (id === null || id === undefined || id === '') {
    return <span className="milano-cell-empty">—</span>
  }

  const names = await categoryNames(payload)
  return <span>{names.get(String(id)) ?? '—'}</span>
}
