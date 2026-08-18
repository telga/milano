/** Decode ABC base64-encoded JSON payloads from API responses. */
export function decodeAbcPayload<T = unknown>(encoded: string): T {
  const json = Buffer.from(encoded, 'base64').toString('utf8')
  return JSON.parse(json) as T
}

export function encodeAbcPayload(value: unknown): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64')
}
