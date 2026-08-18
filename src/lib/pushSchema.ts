import { pushSchema } from 'drizzle-kit/api'
import type { Payload } from 'payload'

type SchemaAdapter = {
  drizzle?: object
  extensions?: Record<string, boolean>
  schema?: Record<string, unknown>
  schemaName?: string
  tablesFilter?: string[]
}

/**
 * Payload skips Drizzle push when NODE_ENV=production, so Vercel + Neon
 * would otherwise connect successfully with zero tables. Apply the schema
 * without the interactive CLI prompts used in local `pushDevSchema`.
 */
export async function pushPayloadSchema(payload: Payload): Promise<void> {
  const adapter = payload.db as SchemaAdapter
  if (!adapter.schema || !adapter.drizzle) {
    return
  }

  const { apply } = await pushSchema(
    adapter.schema,
    adapter.drizzle as never,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter,
    adapter.extensions?.postgis ? ['postgis'] : undefined,
  )
  await apply()
}
