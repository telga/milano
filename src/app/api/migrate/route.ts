import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'

/** Initialize database schema (first deploy). Protected by SEED_SECRET. */
export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await getPayloadClient()
    return NextResponse.json({ initialized: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Init failed' },
      { status: 500 },
    )
  }
}
