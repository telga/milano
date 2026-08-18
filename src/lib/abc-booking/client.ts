import { abcEndpoint } from '@/lib/abc-booking/constants'

export async function abcPostRaw(
  body: Record<string, unknown>,
): Promise<{ status: number; text: string }> {
  const res = await fetch(abcEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  const text = await res.text()
  return { status: res.status, text }
}

export async function abcPost<T>(body: Record<string, unknown>): Promise<T> {
  const { status, text } = await abcPostRaw(body)

  if (status < 200 || status >= 300) {
    throw new Error(`ABC request failed (${status})`)
  }

  if (!text) {
    throw new Error('ABC returned empty response')
  }

  return JSON.parse(text) as T
}
