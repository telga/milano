import { Check, Sparkles, Star } from 'lucide-react'

import { AboutConnect } from '@/components/AboutConnect'
import { BookButton } from '@/components/BookButton'
import { SlotImage } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { StatsRow } from '@/components/StatsRow'
import { getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { SALON_EXPERIENCE } from '@/lib/salonExperience'
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

const ABOUT_HIGHLIGHTS = [
  { title: 'Luxury Environment', icon: Sparkles },
  { title: 'Highly Skilled Technicians', icon: Star },
  { title: 'Premium Products', icon: Check },
]

export default async function AboutPage() {
  const [settings, slots] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <section className="section-pad">
        <div className="container-luxury grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading as="h1" title="Where Passion Meets" accent="Perfection." />
            <p className="mt-5 max-w-3xl leading-relaxed text-muted sm:mt-6 sm:text-lg">
              {settings?.aboutText ||
                'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry.'}
            </p>
            <ul className="mt-8 space-y-4">
              {ABOUT_HIGHLIGHTS.map(({ title, icon: Icon }) => (
                <li key={title} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="flex h-8 w-8 items-center justify-center border border-gold/40 text-gold">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {title}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <BookButton
                bookingUrl={settings?.bookingUrl || undefined}
                label="Book Appointment"
                variant="outline"
              />
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border sm:aspect-[16/11] lg:aspect-auto lg:min-h-[35rem]">
            <SlotImage slot={slots['about-grid-1']} sizes="(max-width:1024px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-12">
        <div className="container-luxury">
          <StatsRow />
          <AboutConnect links={settings?.socialLinks} className="mt-10" />
        </div>
      </section>

      <section className="section-pad">
        <div className="container-luxury grid items-start gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border sm:aspect-[16/11] lg:aspect-auto lg:min-h-[28rem]">
            <SlotImage
              slot={slots['visit-us-hero'] || slots['about-grid-2']}
              sizes="(max-width:1024px) 100vw, 45vw"
            />
          </div>
          <div>
            <SectionHeading title="The Salon" accent="Experience." />
            <p className="mt-5 leading-relaxed text-muted">
              Walk into a calm, elevated space built for unhurried pampering — from spacious rooms
              to carefully curated details that make every visit feel special.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SALON_EXPERIENCE.map((point) => (
                <article key={point.title} className="luxury-card p-5 sm:p-6">
                  <div className="gold-rule mb-3" />
                  <h3 className="font-display text-lg text-gold sm:text-xl">{point.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{point.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface section-pad">
        <div className="container-luxury grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(['about-grid-1', 'about-grid-2', 'about-grid-3', 'about-grid-4'] as const).map(
            (id) => (
              <div key={id} className="relative aspect-[4/3] overflow-hidden border border-border">
                <SlotImage slot={slots[id]} sizes="25vw" />
              </div>
            ),
          )}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-luxury">
          <SectionHeading title="What Sets Us" accent="Apart." />
          <ul className="mt-8 grid gap-4 md:grid-cols-2">
            {DISTINCTIVE_FEATURES.map((feature) => (
              <li key={feature} className="flex gap-3 border border-border bg-surface p-5 text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-surface section-pad">
        <div className="container-luxury max-w-3xl">
          <p className="eyebrow">Community</p>
          <h2 className="mt-3 font-display text-3xl text-gold">Smile of Compassion Projects</h2>
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
