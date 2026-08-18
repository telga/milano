const LOCAL_FALLBACK = 'http://localhost:3000'
const PUBLIC_FALLBACK = 'https://milanonailspaflowermound.com'

/** Accepts `https://host` or host-only values like `milano-demo.vercel.app`. */
export function normalizeSiteUrl(
  raw: string | undefined | null,
  fallback = LOCAL_FALLBACK,
): string {
  const candidate = raw?.trim() || fallback
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`
  try {
    return new URL(withProtocol).origin
  } catch {
    return new URL(fallback).origin
  }
}

export function getSiteUrl(fallback = LOCAL_FALLBACK): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SERVER_URL, fallback)
}

export function getPublicSiteUrl(): string {
  return getSiteUrl(PUBLIC_FALLBACK)
}
