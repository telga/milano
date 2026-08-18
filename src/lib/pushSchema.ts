import type { Payload } from 'payload'

type DrizzleKitApi = {
  pushSchema: (
    schema: unknown,
    drizzle: unknown,
    schemaFilters?: string[],
    tablesFilter?: string[],
    extensionsFilter?: string[],
  ) => Promise<{ apply: () => Promise<void> }>
}

type SchemaAdapter = {
  drizzle?: unknown
  extensions?: Record<string, boolean>
  requireDrizzleKit?: () => DrizzleKitApi
  schema?: unknown
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
  if (typeof adapter.requireDrizzleKit !== 'function' || !adapter.schema || !adapter.drizzle) {
    return
  }

  const { pushSchema } = adapter.requireDrizzleKit()
  const { apply } = await pushSchema(
    adapter.schema,
    adapter.drizzle,
    adapter.schemaName ? [adapter.schemaName] : undefined,
    adapter.tablesFilter,
    adapter.extensions?.postgis ? ['postgis'] : undefined,
  )
  await apply()
}
