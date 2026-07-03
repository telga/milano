import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {
  getImageSlot,
  getSiteSettingsSafe,
  getSlotsMapSafe,
} from '@/lib/data'
import { getMediaUrl } from '@/lib/media'

export async function SiteShell({ children }: { children: React.ReactNode }) {
  let logoUrl: string | undefined
  let bookingUrl: string | undefined
  let phone: string | undefined
  let email: string | undefined
  let address: string | undefined

  try {
    const [settings, slots] = await Promise.all([getSiteSettingsSafe(), getSlotsMapSafe()])
    if (!settings) return (
      <>
        <Header />
        <main>{children}</main>
        <Footer />
      </>
    )
    logoUrl = settings.logo
      ? getMediaUrl(settings.logo)
      : slots.logo?.image
        ? getMediaUrl(slots.logo.image)
        : undefined
    bookingUrl = settings.bookingUrl || undefined
    phone = settings.phone || undefined
    email = settings.email || undefined
    address = settings.address || undefined
  } catch {
    // DB not seeded yet — use defaults
  }

  return (
    <>
      <Header logoUrl={logoUrl} bookingUrl={bookingUrl} />
      <main>{children}</main>
      <Footer phone={phone} email={email} address={address} bookingUrl={bookingUrl} />
    </>
  )
}

export async function getSlotOrUndefined(slotId: Parameters<typeof getImageSlot>[0]) {
  try {
    return await getImageSlot(slotId)
  } catch {
    return undefined
  }
}
