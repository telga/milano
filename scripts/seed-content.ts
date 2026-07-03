#!/usr/bin/env node
/**
 * Seed wrapper — triggers seed via local Next.js API (works on Node 24).
 * Requires dev server OR run: npm run build && npm run start
 */
const secret = process.env.SEED_SECRET || 'dev-seed-secret'
const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

async function main() {
  const res = await fetch(`${base}/api/seed`, {
    method: 'POST',
    headers: { 'x-seed-secret': secret },
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('Seed failed:', data)
    process.exit(1)
  }
  console.log('Seed complete:', data)
}

main().catch((err) => {
  console.error(err.message)
  console.error('\nStart the server first: npm run dev')
  console.error('Or bootstrap on empty DB: curl http://localhost:3000/api/bootstrap (with SEED_ON_START=true)')
  process.exit(1)
})
