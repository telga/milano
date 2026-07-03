import { BookButton } from '@/components/BookButton'
import { PageHero } from '@/components/SiteImage'
import { getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Visit Us',
  'Experience Milano Nail Spa Flower Mound — glamour, relaxation, and exquisite nail care.',
)

const EXPERIENCE_POINTS = [
  {
    title: 'Spacious Sanctuary',
    body: 'Over 5,000 square feet designed for comfort, privacy, and unhurried pampering.',
  },
  {
    title: 'Pedicure Excellence',
    body: '40 high-end pedicure chairs across four rooms with massage features, complimentary beverages, and aroma diffusers.',
  },
  {
    title: 'Artistry in Manicures',
    body: '26 manicure stations showcasing seasonal collections and the latest nail trends.',
  },
  {
    title: 'Elevated Ambiance',
    body: 'Lofty ceilings, European-inspired décor, and a curated entertainment experience.',
  },
]

export default async function VisitUsPage() {
  const [settings, slots] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <PageHero
        title="Visit Milano Nail Spa"
        subtitle={settings?.tagline || 'Where glamour meets exquisite nail care'}
        slot={slots['visit-us-hero']}
      >
        <BookButton bookingUrl={settings?.bookingUrl || undefined} />
      </PageHero>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          {EXPERIENCE_POINTS.map((point) => (
            <article key={point.title} className="border border-border bg-surface p-8">
              <h2 className="font-display text-2xl text-gold">{point.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{point.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
