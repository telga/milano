import { BookButton } from '@/components/BookButton'
import { ContentCardGrid } from '@/components/ContentCards'
import { PageHero } from '@/components/SiteImage'
import { resolveBookingHref } from '@/lib/booking'
import { getSiteSettings, getSlotsMapSafe, getSpecialties } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Specialties',
  'Best nail designs and specialty nail art at Milano Nail Spa Flower Mound.',
)

export default async function SpecialtiesPage() {
  const [specialties, settings, slots] = await Promise.all([
    getSpecialties().catch(() => []),
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  const bookingHref = resolveBookingHref(settings)

  return (
    <>
      <PageHero
        title="Specialties"
        subtitle="Best Nail Design For You"
        slot={slots['specialties-hero']}
      />
      <section className="section-pad">
        <div className="container-luxury">
          <ContentCardGrid items={specialties} basePath="/specialties" />
          {!specialties.length && (
            <p className="text-center text-muted">
              From classic elegance to bold nail art, our technicians create designs tailored to
              your style using premium products and the latest techniques.
            </p>
          )}
          <div className="mt-12 text-center">
            <BookButton bookingHref={bookingHref} label="Book Appointment" />
          </div>
        </div>
      </section>
    </>
  )
}
