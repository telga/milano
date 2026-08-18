import { NextResponse } from 'next/server'

import { getPayloadClient } from '@/lib/payload'
import { pushPayloadSchema } from '@/lib/pushSchema'

export const maxDuration = 60

/** Create / update database tables. Protected by SEED_SECRET. */
export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    await pushPayloadSchema(payload)
    return NextResponse.json({ initialized: true, schemaPushed: true })
  } catch (error) {
    console.error(error)
    const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Init failed',
        cause,
      },
      { status: 500 },
    )
  }
}
