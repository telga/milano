#!/usr/bin/env node
/**
 * Reassign distinct images to each site image slot via local Next.js API.
 * Requires dev server with latest code — restart with `npm run dev` if you see "Route not found".
 */
import 'dotenv/config'

const secret = process.env.SEED_SECRET || 'dev-seed-secret'

function baseUrls(): string[] {
  const configured = [
    process.env.NEXT_PUBLIC_SERVER_URL,
    process.env.PLAYWRIGHT_BASE_URL,
    process.env.PORT ? `http://localhost:${process.env.PORT}` : null,
  ].filter(Boolean) as string[]

  const defaults = ['http://localhost:3000', 'http://localhost:3001']
  return [...new Set([...configured, ...defaults])]
}

async function tryFix(base: string) {
  const endpoints = [`${base}/api/fix-images`, `${base}/api/seed?fixImagesOnly=true`]

  for (const url of endpoints) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'x-seed-secret': secret },
    })
    const data = await res.json()

    if (res.ok) return { ok: true as const, data, base }

    const routeMissing =
      res.status === 404 ||
      (typeof data?.message === 'string' && data.message.includes('Route not found'))

    if (!routeMissing) {
      return { ok: false as const, data, base, fatal: true }
    }
  }

  return { ok: false as const, base, fatal: false }
}

async function main() {
  let lastError: unknown

  for (const base of baseUrls()) {
    try {
      const result = await tryFix(base)
      if (result.ok) {
        console.log(`Image slots updated (${base}):`, result.data)
        return
      }
      if (result.fatal) {
        console.error('Fix images failed:', result.data)
        process.exit(1)
      }
    } catch (err) {
      lastError = err
    }
  }

  console.error(
    'Fix images failed: could not reach the dev server or route not found.\n' +
      'Restart the dev server, then retry:\n\n' +
      '  npm run dev\n' +
      '  npm run fix:images\n',
  )
  if (lastError instanceof Error) console.error(lastError.message)
  process.exit(1)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
