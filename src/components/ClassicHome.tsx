import Link from 'next/link'
import { ArrowRight, Check, Clock, Mail, MapPin, Phone, Sparkles, Star } from 'lucide-react'

import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { AboutConnect } from '@/components/AboutConnect'
import { BookButton } from '@/components/BookButton'
import { BlogCardGrid, ContentCardGrid } from '@/components/ContentCards'
import { ContactForm } from '@/components/ContactForm'
import { GalleryGrid } from '@/components/GalleryGrid'
import { ServiceAccordion } from '@/components/ServiceAccordion'
import { ServiceIconGrid } from '@/components/ServiceIconGrid'
import { HomeHero, PageHero, SlotImage } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { SocialLinks } from '@/components/SocialLinks'
import { StatsRow } from '@/components/StatsRow'
import { resolveBookingHref } from '@/lib/booking'
import { BUSINESS } from '@/lib/constants'
import { SALON_EXPERIENCE } from '@/lib/salonExperience'
import {
  getActiveHomePopup,
  getBlogPosts,
  getGalleryItems,
  getPromotions,
  getServiceCategories,
  getServicesByCategory,
  getSiteSettings,
  getSlotsMapSafe,
  getSpecialties,
} from '@/lib/data'
import { getMediaUrl } from '@/lib/media'

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

export async function ClassicHome() {
  const [
    slots,
    settings,
    galleryItems,
    blogPosts,
    promotions,
    specialties,
    serviceGroups,
    categories,
    popup,
  ] = await Promise.all([
    getSlotsMapSafe(),
    getSiteSettings().catch(() => null),
    getGalleryItems().catch(() => []),
    getBlogPosts().catch(() => []),
    getPromotions().catch(() => []),
    getSpecialties().catch(() => []),
    getServicesByCategory().catch(() => []),
    getServiceCategories().catch(() => []),
    getActiveHomePopup(),
  ])

  const aboutText = settings?.aboutText
  const bookingHref = resolveBookingHref(settings)
  const logoUrl = settings?.logo
    ? getMediaUrl(settings.logo)
    : slots.logo?.image
      ? getMediaUrl(slots.logo.image)
      : undefined

  const phone = settings?.phone || BUSINESS.phone
  const email = settings?.email || BUSINESS.email
  const address = settings?.address || BUSINESS.address
  const hours = settings?.hours || [
    { label: 'Mon – Sat', value: '9:00 AM – 7:00 PM' },
    { label: 'Sunday', value: '10:00 AM – 5:00 PM' },
  ]

  return (
    <>
      <AnnouncementPopup
        announcement={popup}
        siteLogoUrl={logoUrl}
        phone={settings?.phone || undefined}
      />

      <div id="home">
        <HomeHero
          slot={slots['home-hero']}
          bookingHref={bookingHref}
          servicesHref="/#services"
        />
      </div>

      <section className="section-pad">
        <div className="container-luxury">
          <SectionHeading
            title="Excellence in Every"
            accent="Service."
            aside={
              <p className="max-w-xl text-sm leading-relaxed text-muted">
                Explore promotions, specialties, services, and gallery highlights.
              </p>
            }
            className="mb-10"
          />
          <ServiceIconGrid
            categories={categories}
            basePath="/#services"
            hideIcons={settings?.hideServiceCardIcons || false}
          />
        </div>
      </section>

      <section id="about" className="scroll-mt-24 border-y border-border bg-surface section-pad">
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
            <div className="mt-9">
              <BookButton
                bookingHref={bookingHref}
                label="Book Appointment"
                variant="outline"
              />
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-border sm:aspect-[16/11] lg:aspect-auto lg:min-h-[34rem]">
            <SlotImage slot={slots['about-grid-1']} sizes="(max-width:1024px) 100vw, 45vw" />
          </div>
        </div>
        <div className="container-luxury mt-14 border-t border-border pt-10">
          <StatsRow />
          <AboutConnect links={settings?.socialLinks} className="mt-10" />
        </div>
        <div className="container-luxury mt-14">
          <SectionHeading title="The Salon" accent="Experience." className="mb-8" />
          <div className="grid items-start gap-10 lg:grid-cols-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-border sm:aspect-[16/11] lg:aspect-auto lg:min-h-[24rem]">
              <SlotImage
                slot={slots['visit-us-hero'] || slots['about-grid-2']}
                sizes="(max-width:1024px) 100vw, 45vw"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
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

      <section id="promotions" className="scroll-mt-24 border-y border-border bg-surface section-pad">
        <div className="container-luxury">
          <PageHero
            title="Promotions"
            subtitle="Exceptional value with monthly promotions and seasonal discounts"
            slot={slots['promotions-hero']}
          />
          <div className="mt-12">
            <ContentCardGrid items={promotions} basePath="/promotions" />
            {!promotions.length && (
              <p className="text-center text-muted">
                We consistently offer monthly promotions and weekly discounts for medical
                professionals, students, educators, military personnel, seniors, and birthday
                celebrations.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="specialties" className="scroll-mt-24 section-pad">
        <div className="container-luxury">
          <PageHero
            title="Specialties"
            subtitle="Best Nail Design For You"
            slot={slots['specialties-hero']}
          />
          <div className="mt-12">
            <ContentCardGrid items={specialties} basePath="/specialties" />
          </div>
        </div>
      </section>

      <section id="services" className="scroll-mt-24 border-y border-border bg-surface section-pad">
        <div className="container-luxury">
          <SectionHeading title="Excellence in Every" accent="Service." className="mb-10" />
          <ServiceIconGrid
            categories={categories}
            basePath="/#services"
            hideIcons={settings?.hideServiceCardIcons || false}
          />
          <div className="mx-auto mt-14 max-w-4xl">
            <ServiceAccordion groups={serviceGroups} />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-24 section-pad">
        <div className="container-luxury">
          <SectionHeading
            title="Artistry. Luxury."
            accent="You."
            align="center"
            className="mb-10"
          />
          <GalleryGrid items={galleryItems} showFilters />
        </div>
      </section>

      <section id="blog" className="scroll-mt-24 border-y border-border bg-surface section-pad">
        <div className="container-luxury">
          <PageHero title="Blog" subtitle="Stories from Milano Nail Spa" slot={slots['blog-hero']} />
          <div className="mt-12">
            <BlogCardGrid posts={blogPosts} />
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 section-pad">
        <div className="container-luxury grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading title="We'd Love to Hear" accent="From You." />
            <ul className="mt-8 space-y-5 text-sm text-muted">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold" aria-hidden />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-gold">
                  {phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold" aria-hidden />
                <a href={`mailto:${email}`} className="hover:text-gold">
                  {email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <div>
                  <p>{address}</p>
                  <a
                    href={BUSINESS.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-gold hover:underline"
                  >
                    Get Directions <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </li>
            </ul>
            <SocialLinks links={settings?.socialLinks} className="mt-8" />
            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <Clock className="h-4 w-4 text-gold" aria-hidden />
                <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">Business Hours</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted">
                {hours.map((row) => (
                  <li key={row.label} className="flex max-w-xs justify-between gap-8">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ContactForm email={email} services={categories.map((c) => c.name)} />
        </div>
      </section>

      <div className="pb-10 text-center">
        <Link
          href="/blog/distinctive-features-of-milano-nail-spa-in-flower-mound"
          className="text-[11px] uppercase tracking-[0.22em] text-gold/70 hover:text-gold"
        >
          Read our featured story
        </Link>
      </div>
    </>
  )
}
