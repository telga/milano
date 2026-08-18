import { BookButton } from '@/components/BookButton'
import { ContentCardGrid } from '@/components/ContentCards'
import { PageHero } from '@/components/SiteImage'
import { resolveBookingHref } from '@/lib/booking'
import { getPromotions, getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Promotions',
  'Monthly promotions and seasonal specials at Milano Nail Spa Flower Mound.',
)

export default async function PromotionsPage() {
  const [promotions, settings, slots] = await Promise.all([
    getPromotions().catch(() => []),
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  const bookingHref = resolveBookingHref(settings)

  return (
    <>
      <PageHero
        title="Promotions"
        subtitle="Exceptional value with monthly promotions and seasonal discounts"
        slot={slots['promotions-hero']}
      />
      <section className="section-pad">
        <div className="container-luxury">
          <ContentCardGrid items={promotions} basePath="/promotions" />
          {!promotions.length && (
            <p className="text-center text-muted">
              We consistently offer monthly promotions and weekly discounts for medical
              professionals, students, educators, military personnel, seniors, and birthday
              celebrations. Call or book online for current offers.
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
