/**
 * Payload CMS generated types — run `npm run generate:types` to regenerate.
 * Stub types for build until generation succeeds.
 */

export interface Media {
  id: number
  alt: string
  url?: string | null
  filename?: string | null
  sourceUrl?: string | null
  width?: number | null
  cloudinary?: {
    cloudName?: string
    publicId?: string
  } | null
  height?: number | null
}

export interface SiteImageSlot {
  id: number
  slotId: string
  label: string
  page: string
  usePlaceholder?: boolean | null
  image?: Media | number | null
  darkModeImage?: Media | number | null
  sortOrder?: number | null
}

export interface ServiceCategory {
  id: number
  name: string
  slug: string
  description?: string | null
  sortOrder?: number | null
  published?: boolean | null
}

export interface Service {
  id: number
  name: string
  category: ServiceCategory | number
  durationMinutes?: number | null
  description?: string | null
  bullets?: Array<{ text: string; id?: string }> | null
  price?: number | null
  showPrice?: boolean | null
  abcServiceId?: string | null
  sortOrder?: number | null
  published?: boolean | null
}

export interface Promotion {
  id: number
  title: string
  subtitle?: string | null
  body?: string | null
  image?: Media | number | null
  sortOrder?: number | null
  published?: boolean | null
}

export interface Specialty {
  id: number
  title: string
  subtitle?: string | null
  body?: string | null
  image?: Media | number | null
  sortOrder?: number | null
  published?: boolean | null
}

export interface GalleryItem {
  id: number
  image: Media | number
  caption?: string | null
  category?: string | null
  sortOrder?: number | null
  published?: boolean | null
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: Media | number | null
  content?: unknown
  status: 'draft' | 'published'
  publishedAt?: string | null
}

export interface SiteSetting {
  businessName?: string | null
  tagline?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  bookingUrl?: string | null
  aboutText?: string | null
  logo?: Media | number | null
  hours?: Array<{ label: string; value: string; id?: string }> | null
  socialLinks?: Array<{ platform: string; url: string; id?: string }> | null
  hiddenNavigationItems?: Array<
    'home' | 'about' | 'promotions' | 'specialties' | 'services' | 'gallery' | 'blog' | 'contact'
  > | null
  hideServiceCardIcons?: boolean | null
  useCustomBookingFrontend?: boolean | null
  useNativeAbcBooking?: boolean | null
  seo?: {
    title?: string | null
    description?: string | null
  } | null
}

export interface PopupAnnouncement {
  id: number
  title: string
  headline: string
  body: string
  highlightLine?: string | null
  signature?: string | null
  logo?: Media | number | null
  instagramHandle?: string | null
  showOnHome?: boolean | null
  active?: boolean | null
  published?: boolean | null
  startDate?: string | null
  endDate?: string | null
  sortOrder?: number | null
  updatedAt?: string | null
}
