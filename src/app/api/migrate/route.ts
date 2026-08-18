import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

/** Create / update database tables. Protected by SEED_SECRET. */
export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-seed-secret')
    if (!secret || secret !== process.env.SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getPayloadClient } = await import('@/lib/payload')
    const { pushPayloadSchema } = await import('@/lib/pushSchema')
    const payload = await getPayloadClient()
    await pushPayloadSchema(payload)
    return NextResponse.json({ initialized: true, schemaPushed: true })
  } catch (error) {
    console.error(error)
    const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : undefined
    return NextResponse.json({ error: errorMessage(error), cause }, { status: 500 })
  }
}
