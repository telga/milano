import { createRequire } from 'module'
import type { Payload } from 'payload'

const require = createRequire(import.meta.url)

type SchemaAdapter = {
  drizzle?: object
  extensions?: Record<string, boolean>
  schema?: Record<string, unknown>
  schemaName?: string
  tablesFilter?: string[]
}

type PushSchema = (
  schema: Record<string, unknown>,
  drizzle: never,
  schemaFilters?: string[],
  tablesFilter?: string[],
  extensionsFilter?: string[],
) => Promise<{ apply: () => Promise<void> }>

/**
 * Payload skips Drizzle push when NODE_ENV=production. Load drizzle-kit via
 * Node require (not the Next bundler) so esbuild's native binary stays intact.
 */
export async function pushPayloadSchema(payload: Payload): Promise<void> {
  const adapter = payload.db as SchemaAdapter
  if (!adapter.schema || !adapter.drizzle) {
    throw new Error('Postgres adapter is not ready to push schema')
  }

  const kit = require('drizzle-kit/api') as { pushSchema: PushSchema }
  const { apply } = await kit.pushSchema(
    adapter.schema,
    adapter.drizzle as never,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter,
    adapter.extensions?.postgis ? ['postgis'] : undefined,
  )
  await apply()
}
