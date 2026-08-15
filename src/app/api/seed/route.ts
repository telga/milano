import { NextResponse } from 'next/server'

import { runFixImageSlots } from '@/lib/fix-image-slots'
import { getPayloadClient } from '@/lib/payload'
import { backfillStaffUsernames, runSeed } from '@/lib/seed'

export async function POST(request: Request) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const params = new URL(request.url).searchParams
  const fixOnly = params.get('fixImagesOnly') === 'true'
  const usernamesOnly = params.get('backfillUsernames') === 'true'

  try {
    const payload = await getPayloadClient()

    if (usernamesOnly) {
      const result = await backfillStaffUsernames(payload)
      return NextResponse.json(result)
    }

    if (fixOnly) {
      const result = await runFixImageSlots(payload)
      return NextResponse.json(result)
    }

    const result = await runSeed(payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 },
    )
  }
}
