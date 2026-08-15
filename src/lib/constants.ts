export const BOOKING_URL = 'https://abcapp.us/feedback/appointment?appid=tI8PdCO'

export const BUSINESS = {
  name: 'Milano Nail Spa Flower Mound',
  tagline: 'Where glamour meets exquisite nail care',
  phone: '(214) 513-4800',
  phoneHref: 'tel:+12145134800',
  email: 'milanonailflowermound@gmail.com',
  address: '5801 Long Prairie Road, Suite 680, Flower Mound, TX 75028',
  mapsUrl: 'https://maps.google.com/?q=5801+Long+Prairie+Road+Suite+680+Flower+Mound+TX+75028',
} as const

export const NAV_LINKS = [
  { href: '/', label: 'Home', anchor: 'home' },
  { href: '/services', label: 'Services', anchor: 'services' },
  { href: '/gallery', label: 'Gallery', anchor: 'gallery' },
  { href: '/about', label: 'About Us', anchor: 'about' },
  { href: '/contact', label: 'Contact', anchor: 'contact' },
  { href: '/promotions', label: 'Promotions', anchor: 'promotions' },
  { href: '/specialties', label: 'Specialties', anchor: 'specialties' },
  { href: '/blog', label: 'Blog', anchor: 'blog' },
] as const

export const CLASSIC_LAYOUT = process.env.NEXT_PUBLIC_CLASSIC_LAYOUT === 'true'

export function isClassicLayout(): boolean {
  return CLASSIC_LAYOUT
}

export function navHref(link: (typeof NAV_LINKS)[number], classic = isClassicLayout()): string {
  if (!classic) return link.href
  if (link.anchor === 'home') return '/'
  return `/#${link.anchor}`
}

export const LEGACY_SITE = 'https://milanonailspaflowermound.com'

export const REVALIDATE_SECONDS = 60
