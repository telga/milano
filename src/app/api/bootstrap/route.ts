import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import { runSeed } from '@/lib/seed'

/** Dev/local bootstrap — seeds DB on first request when SEED_ON_START=true */
export async function GET() {
  if (process.env.SEED_ON_START !== 'true') {
    return NextResponse.json({ skipped: true })
  }

  try {
    const payload = await getPayloadClient()
    const users = await payload.find({ collection: 'users', limit: 1 })
    if (users.docs.length > 0) {
      return NextResponse.json({ skipped: true, reason: 'already seeded' })
    }
    const result = await runSeed(payload)
    revalidateTag('site-content')
    revalidatePath('/', 'layout')
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Bootstrap failed' },
      { status: 500 },
    )
  }
}
