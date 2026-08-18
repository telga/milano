import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'https://milanonailspaflowermound.com'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dev/', ...(process.env.DEV_DASHBOARD_PATH && process.env.DEV_DASHBOARD_PATH !== 'dev' ? [`/${process.env.DEV_DASHBOARD_PATH.replace(/^\/+|\/+$/g, '')}/`] : [])],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
