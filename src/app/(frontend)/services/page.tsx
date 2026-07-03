import { BookButton } from '@/components/BookButton'
import { PageHero } from '@/components/SiteImage'
import { ServiceAccordion } from '@/components/ServiceAccordion'
import { getServicesByCategory, getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Services',
  'Full menu of manicures, pedicures, dip powder, acrylic, gel, lashes, and waxing services.',
)

export default async function ServicesPage() {
  const [groups, settings, slots] = await Promise.all([
    getServicesByCategory().catch(() => []),
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <PageHero
        title="Services"
        subtitle="We Have Many Services"
        slot={slots['services-hero']}
      />
      <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
        <ServiceAccordion groups={groups} />
        <div className="mt-12 text-center">
          <BookButton bookingUrl={settings?.bookingUrl || undefined} label="Book Appointment" />
        </div>
      </section>
    </>
  )
}
