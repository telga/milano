import { BookButton } from '@/components/BookButton'
import { SlotImage } from '@/components/SiteImage'
import { getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'About Us',
  'Learn about Milano Nail Spa Flower Mound — luxury nail care, community, and charitable giving.',
)

const CHARITY_STORY = `Above all, a substantial portion of our proceeds is dedicated to charitable endeavors. LEO company who owns Milano Nail Spa in Flower Mound are affiliated with a group of friends who, 35 years ago, shared refuge in a Malaysian camp. A decade ago, we collectively established a non-profit organization known as 'Smile of Compassion Projects'. Our primary focus centers on assisting disadvantaged individuals in Vietnam.

Our philanthropic initiatives encompass the construction of schools, bridges, and water wells, the provision of winter attire for children, medication support for individuals afflicted with leprosy, and the supply of specialized wheelchairs to children with cerebral palsy. Furthermore, we extend essential provisions and sustenance to orphanages and facilities for abandoned children and senior citizens. We offer complimentary cataract surgeries and eye care to both seniors and children and lead international medical missions addressing issues such as cleft palate and burn scar corrections.

When you choose to patronize our establishment, you not only receive impeccable customer service and access to premium quality services but also become a meaningful contributor to the amelioration of the lives of those in dire need.`

const DISTINCTIVE_FEATURES = [
  'Expansive 5,000+ sq ft space for comfort and privacy',
  '40 cutting-edge pedicure chairs across four tranquil rooms',
  '26 manicure stations with seasonal artistic collections',
  'European-inspired décor with elevated ceilings and ambiance',
  'Highly trained technicians specializing in foot massage and nail art',
  'Over 2,000 polish and powder colors including OPI and iGel',
  'Monthly promotions plus weekly discounts for military, students, seniors & more',
  'Comprehensive services: nails, lashes, and full-body waxing',
]

export default async function AboutPage() {
  const [settings, slots] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">About Us</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl text-foreground">
          About Milano Nail Spa Flower Mound
        </h1>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted">
          {settings?.aboutText ||
            'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry.'}
        </p>
        <div className="mt-10">
          <BookButton bookingUrl={settings?.bookingUrl || undefined} />
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {(['about-grid-1', 'about-grid-2', 'about-grid-3', 'about-grid-4'] as const).map(
            (id) => (
              <div key={id} className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <SlotImage slot={slots[id]} sizes="25vw" />
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <h2 className="font-display text-3xl text-gold">What Sets Us Apart</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {DISTINCTIVE_FEATURES.map((feature) => (
            <li
              key={feature}
              className="border-l-2 border-gold/40 pl-4 text-muted"
            >
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border bg-cream/40 py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <h2 className="font-display text-3xl text-gold">Smile of Compassion Projects</h2>
          <div className="mt-8 space-y-4 leading-relaxed text-muted">
            {CHARITY_STORY.split('\n\n').map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
