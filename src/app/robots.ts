import type { MetadataRoute } from 'next'

import { getPublicSiteUrl } from '@/lib/siteUrl'

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteUrl()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dev/', ...(process.env.DEV_DASHBOARD_PATH && process.env.DEV_DASHBOARD_PATH !== 'dev' ? [`/${process.env.DEV_DASHBOARD_PATH.replace(/^\/+|\/+$/g, '')}/`] : [])],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
