import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MetricsBeacon } from '@/components/metrics/MetricsBeacon'
import { resolveBookingHref } from '@/lib/booking'
import { getImageSlot, getSiteSettingsSafe } from '@/lib/data'
import type { SiteSetting } from '@/payload-types'

export async function SiteShell({ children }: { children: React.ReactNode }) {
  let bookingHref: string | undefined
  let phone: string | undefined
  let email: string | undefined
  let address: string | undefined
  let socialLinks: SiteSetting['socialLinks'] | undefined
  let hiddenNavigationItems: SiteSetting['hiddenNavigationItems'] | undefined

  try {
    const settings = await getSiteSettingsSafe()
    if (!settings) {
      return (
        <>
          <Header />
          <main>{children}</main>
          <Footer />
          <MetricsBeacon />
        </>
      )
    }
    bookingHref = resolveBookingHref(settings)
    phone = settings.phone || undefined
    email = settings.email || undefined
    address = settings.address || undefined
    socialLinks = settings.socialLinks || undefined
    hiddenNavigationItems = settings.hiddenNavigationItems || undefined
  } catch {
    // DB not seeded yet — use defaults
  }

  return (
    <>
      <Header bookingHref={bookingHref} hiddenNavigationItems={hiddenNavigationItems} />
      <main>{children}</main>
      <Footer
        phone={phone}
        email={email}
        address={address}
        bookingHref={bookingHref}
        socialLinks={socialLinks}
        hiddenNavigationItems={hiddenNavigationItems}
      />
      <MetricsBeacon />
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
