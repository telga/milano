import type { MetadataRoute } from 'next'

import { NAV_LINKS } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://milanonailspaflowermound.com'
  const now = new Date()

  return [
    ...NAV_LINKS.map((link) => ({
      url: `${base}${link.href === '/' ? '' : link.href}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: link.href === '/' ? 1 : 0.8,
    })),
    {
      url: `${base}/blog/distinctive-features-of-milano-nail-spa-in-flower-mound`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]
}
