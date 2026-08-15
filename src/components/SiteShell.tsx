import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getImageSlot, getSiteSettingsSafe } from '@/lib/data'
import type { SiteSetting } from '@/payload-types'

export async function SiteShell({ children }: { children: React.ReactNode }) {
  let bookingUrl: string | undefined
  let phone: string | undefined
  let email: string | undefined
  let address: string | undefined
  let socialLinks: SiteSetting['socialLinks'] | undefined

  try {
    const settings = await getSiteSettingsSafe()
    if (!settings) {
      return (
        <>
          <Header />
          <main>{children}</main>
          <Footer />
        </>
      )
    }
    bookingUrl = settings.bookingUrl || undefined
    phone = settings.phone || undefined
    email = settings.email || undefined
    address = settings.address || undefined
    socialLinks = settings.socialLinks || undefined
  } catch {
    // DB not seeded yet — use defaults
  }

  return (
    <>
      <Header bookingUrl={bookingUrl} />
      <main>{children}</main>
      <Footer
        phone={phone}
        email={email}
        address={address}
        bookingUrl={bookingUrl}
        socialLinks={socialLinks}
      />
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
