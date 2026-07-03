import { NextResponse } from 'next/server'

import { runFixImageSlots } from '@/lib/fix-image-slots'
import { getPayloadClient } from '@/lib/payload'

export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayloadClient()
    const result = await runFixImageSlots(payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Fix images failed' },
      { status: 500 },
    )
  }
}
