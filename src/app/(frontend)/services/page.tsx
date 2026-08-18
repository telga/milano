import { BookButton } from '@/components/BookButton'
import { PageHero } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { ServiceAccordion } from '@/components/ServiceAccordion'
import { ServiceIconGrid } from '@/components/ServiceIconGrid'
import { resolveBookingHref } from '@/lib/booking'
import {
  getServiceCategories,
  getServicesByCategory,
  getSiteSettings,
  getSlotsMapSafe,
} from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Services',
  'Full menu of manicures, pedicures, dip powder, acrylic, gel, lashes, and waxing services.',
)

export default async function ServicesPage() {
  const [groups, settings, slots, categories] = await Promise.all([
    getServicesByCategory().catch(() => []),
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
    getServiceCategories().catch(() => []),
  ])

  const bookingHref = resolveBookingHref(settings)

  return (
    <>
      <PageHero title="Services" subtitle="We Have Many Services" slot={slots['services-hero']} />

      <section className="section-pad">
        <div className="container-luxury">
          <SectionHeading
            title="Excellence in Every"
            accent="Service."
            aside={
              <p className="max-w-xl text-sm leading-relaxed text-muted">
                Browse our full treatment menu, then book the service that fits your style.
              </p>
            }
            className="mb-10"
          />
          <ServiceIconGrid
            categories={categories}
            hideIcons={settings?.hideServiceCardIcons || false}
          />
        </div>
      </section>

      <section id="menu" className="scroll-mt-28 section-pad">
        <div className="container-luxury max-w-4xl">
          <SectionHeading title="Complete" accent="Menu." className="mb-10" />
          <ServiceAccordion groups={groups} />
          <div className="mt-12 text-center">
            <BookButton bookingHref={bookingHref} label="Book Appointment" />
          </div>
        </div>
      </section>
    </>
  )
}
