import type { Metadata } from 'next'

import { BUSINESS } from '@/lib/constants'
import { getSiteSettings } from '@/lib/data'

export async function buildPageMetadata(
  title: string,
  description?: string,
): Promise<Metadata> {
  let settingsDescription = description
  try {
    const settings = await getSiteSettings()
    settingsDescription = description || settings.seo?.description || undefined
  } catch {
    settingsDescription = description
  }

  const fullTitle = title === BUSINESS.name ? title : `${title} | ${BUSINESS.name}`

  return {
    title: fullTitle,
    description: settingsDescription || 'Luxury nail salon in Flower Mound, Texas.',
    openGraph: {
      title: fullTitle,
      description: settingsDescription || undefined,
      siteName: BUSINESS.name,
      locale: 'en_US',
      type: 'website',
    },
  }
}

export function localBusinessJsonLd(settings: {
  businessName?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  bookingUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NailSalon',
    name: settings.businessName || BUSINESS.name,
    telephone: settings.phone || BUSINESS.phone,
    email: settings.email || BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '5801 Long Prairie Road, Suite 680',
      addressLocality: 'Flower Mound',
      addressRegion: 'TX',
      postalCode: '75028',
      addressCountry: 'US',
    },
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://milanonailspaflowermound.com',
    priceRange: '$$',
  }
}
