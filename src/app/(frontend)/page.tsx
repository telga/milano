import Link from 'next/link'
import { ArrowRight, Check, Sparkles, Star } from 'lucide-react'

import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { BookButton } from '@/components/BookButton'
import { BlogCardGrid } from '@/components/ContentCards'
import { GalleryGrid } from '@/components/GalleryGrid'
import { HomeHero, SlotImage } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { ServiceIconGrid } from '@/components/ServiceIconGrid'
import { StatsRow } from '@/components/StatsRow'
import { ClassicHome } from '@/components/ClassicHome'
import {
  getActiveHomePopup,
  getBlogPosts,
  getGalleryItems,
  getServiceCategories,
  getSiteSettings,
  getSlotsMapSafe,
} from '@/lib/data'
import { isClassicLayout } from '@/lib/constants'
import { getMediaUrl } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata('Milano Nail Spa Flower Mound')

const ABOUT_HIGHLIGHTS = [
  {
    title: 'Luxury Environment',
    body: 'A calm, elevated space designed for unhurried pampering.',
    icon: Sparkles,
  },
  {
    title: 'Highly Skilled Technicians',
    body: 'Artistry and precision from highly trained nail specialists.',
    icon: Star,
  },
  {
    title: 'Premium Products',
    body: 'Curated polishes and treatments for lasting, beautiful results.',
    icon: Check,
  },
]

export default async function HomePage() {
  if (isClassicLayout()) {
    return <ClassicHome />
  }

  const [slots, settings, galleryItems, blogPosts, popup, categories] = await Promise.all([
    getSlotsMapSafe(),
    getSiteSettings().catch(() => null),
    getGalleryItems().catch(() => []),
    getBlogPosts().catch(() => []),
    getActiveHomePopup(),
    getServiceCategories().catch(() => []),
  ])

  const aboutText = settings?.aboutText
  const logoUrl = settings?.logo
    ? getMediaUrl(settings.logo)
    : slots.logo?.image
      ? getMediaUrl(slots.logo.image)
      : undefined

  return (
    <>
      <AnnouncementPopup
        announcement={popup}
        siteLogoUrl={logoUrl}
        phone={settings?.phone || undefined}
      />

      <HomeHero slot={slots['home-hero']} bookingUrl={settings?.bookingUrl || undefined} />

      <section className="section-pad">
        <div className="container-luxury">
          <SectionHeading
            title="Excellence in Every"
            accent="Service."
            aside={
              <p className="max-w-xl text-sm leading-relaxed text-muted">
                From classic manicures to intricate nail art, explore our full menu of luxurious
                treatments.
              </p>
            }
            className="mb-10"
          />
          <ServiceIconGrid categories={categories} />
        </div>
      </section>

      <section className="border-y border-border bg-surface section-pad">
        <div className="container-luxury grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="Where Passion Meets" accent="Perfection." />
            <p className="mt-6 leading-relaxed text-muted">
              {aboutText ||
                'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry.'}
            </p>
            <ul className="mt-8 space-y-5">
              {ABOUT_HIGHLIGHTS.map(({ title, body, icon: Icon }) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-gold/40 text-gold">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm tracking-wide text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-4">
              <BookButton
                bookingUrl={settings?.bookingUrl || undefined}
                label="Book Appointment"
                variant="outline"
              />
              <Link href="/about" className="link-gold h-11">
                Learn More <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border sm:aspect-[16/11] lg:aspect-auto lg:min-h-[34rem]">
            <SlotImage slot={slots['about-grid-1']} sizes="(max-width:1024px) 100vw, 45vw" />
          </div>
        </div>

        <div className="container-luxury mt-14 border-t border-border pt-10">
          <StatsRow />
        </div>
      </section>

      {galleryItems.length > 0 && (
        <section className="section-pad">
          <div className="container-luxury">
            <SectionHeading
              title="Artistry. Luxury."
              accent="You."
              align="center"
              className="mb-10"
            />
            <GalleryGrid items={galleryItems} showFilters limit={6} />
            <div className="mt-10 text-center">
              <Link
                href="/gallery"
                className="inline-flex h-11 items-center gap-2 border border-gold px-8 text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
              >
                View Full Gallery <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="border-t border-border bg-surface section-pad">
          <div className="container-luxury">
            <SectionHeading title="Latest" accent="Stories." className="mb-10" />
            <BlogCardGrid posts={blogPosts.slice(0, 2)} />
          </div>
        </section>
      )}

      <section className="border-t border-border section-pad">
        <div className="container-luxury flex flex-col items-start justify-between gap-6 md:flex-row md:items-center md:gap-8">
          <div>
            <h2 className="font-display text-2xl text-foreground sm:text-3xl">Ready to Glow?</h2>
            <p className="mt-2 max-w-lg text-sm text-muted">
              Reserve your next appointment and experience Milano Nail Spa Flower Mound.
            </p>
          </div>
          <BookButton
            bookingUrl={settings?.bookingUrl || undefined}
            size="lg"
            label="Book Appointment"
            className="w-full sm:w-auto"
          />
        </div>
      </section>
    </>
  )
}
