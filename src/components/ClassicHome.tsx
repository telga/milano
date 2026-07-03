import Link from 'next/link'

import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { BookButton } from '@/components/BookButton'
import { BlogCardGrid, ContentCardGrid } from '@/components/ContentCards'
import { GalleryGrid } from '@/components/GalleryGrid'
import { ServiceAccordion } from '@/components/ServiceAccordion'
import { FeatureTile, HomeHero, PageHero, SlotImage } from '@/components/SiteImage'
import { BUSINESS } from '@/lib/constants'
import {
  getActiveHomePopup,
  getBlogPosts,
  getGalleryItems,
  getPromotions,
  getServicesByCategory,
  getSiteSettings,
  getSlotsMapSafe,
  getSpecialties,
} from '@/lib/data'
import { getMediaUrl } from '@/lib/media'

const EXPERIENCE_POINTS = [
  {
    title: 'Spacious Sanctuary',
    body: 'Over 5,000 square feet designed for comfort, privacy, and unhurried pampering.',
  },
  {
    title: 'Pedicure Excellence',
    body: '40 high-end pedicure chairs across four rooms with massage features and complimentary beverages.',
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

export async function ClassicHome() {
  const [
    slots,
    settings,
    galleryItems,
    blogPosts,
    promotions,
    specialties,
    serviceGroups,
    popup,
  ] = await Promise.all([
    getSlotsMapSafe(),
    getSiteSettings().catch(() => null),
    getGalleryItems().catch(() => []),
    getBlogPosts().catch(() => []),
    getPromotions().catch(() => []),
    getSpecialties().catch(() => []),
    getServicesByCategory().catch(() => []),
    getActiveHomePopup(),
  ])

  const aboutText = settings?.aboutText
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
        <HomeHero slot={slots['home-hero']} bookingUrl={settings?.bookingUrl || undefined} />
      </div>

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureTile href="/#promotions" title="Promotions" slot={slots['home-tile-promotions']} />
          <FeatureTile
            href="/#specialties"
            title="Specialties"
            subtitle="Best Nail Design For You"
            slot={slots['home-tile-specialties']}
          />
          <FeatureTile
            href="/#services"
            title="Services"
            subtitle="We Have Many Services"
            slot={slots['home-tile-services']}
          />
          <FeatureTile
            href="/#gallery"
            title="Gallery"
            subtitle="Top Best Ever Finished"
            slot={slots['home-tile-gallery']}
          />
        </div>
      </section>

      <section id="about" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">About Us</p>
            <h2 className="mt-4 font-display text-4xl text-foreground">About Milano Nail Spa</h2>
            <p className="mt-6 leading-relaxed text-foreground/75">
              {aboutText ||
                'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry.'}
            </p>
            <div className="mt-8">
              <BookButton bookingUrl={settings?.bookingUrl || undefined} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(['about-grid-1', 'about-grid-2', 'about-grid-3', 'about-grid-4'] as const).map(
              (id) => (
                <div key={id} className="relative aspect-square overflow-hidden rounded-sm">
                  <SlotImage slot={slots[id]} sizes="(max-width:768px) 50vw, 25vw" />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="visit-us" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PageHero
            title="Visit Milano Nail Spa"
            subtitle={settings?.tagline || 'Where glamour meets exquisite nail care'}
            slot={slots['visit-us-hero']}
          />
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {EXPERIENCE_POINTS.map((point) => (
              <article key={point.title} className="border border-border bg-surface p-8">
                <h3 className="font-display text-2xl text-gold">{point.title}</h3>
                <p className="mt-4 leading-relaxed text-foreground/75">{point.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="promotions" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PageHero
            title="Promotions"
            subtitle="Exceptional value with monthly promotions and seasonal discounts"
            slot={slots['promotions-hero']}
          />
          <div className="mt-12">
            <ContentCardGrid items={promotions} basePath="/promotions" />
            {!promotions.length && (
              <p className="text-center text-foreground/70">
                We consistently offer monthly promotions and weekly discounts for medical
                professionals, students, educators, military personnel, seniors, and birthday
                celebrations.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="specialties" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
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

      <section id="services" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <PageHero
            title="Services"
            subtitle="We Have Many Services"
            slot={slots['services-hero']}
          />
          <div className="mt-12">
            <ServiceAccordion groups={serviceGroups} />
          </div>
        </div>
      </section>

      <section id="gallery" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PageHero
            title="Gallery"
            subtitle="Top Best Ever Finished"
            slot={slots['gallery-hero']}
          />
          <div className="mt-12">
            <GalleryGrid items={galleryItems} />
          </div>
        </div>
      </section>

      <section id="blog" className="scroll-mt-20 bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PageHero title="Blog" subtitle="Stories from Milano Nail Spa" slot={slots['blog-hero']} />
          <div className="mt-12">
            <BlogCardGrid posts={blogPosts} />
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <PageHero title="Contact" subtitle="For any inquiries" slot={slots['contact-hero']} />
          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold">Store Location</h3>
                <p className="mt-2 text-foreground/80">{address}</p>
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-gold hover:underline"
                >
                  Get Directions
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold">Phone</h3>
                <a
                  href={`tel:${phone.replace(/\D/g, '')}`}
                  className="mt-2 block text-foreground/80 hover:text-gold"
                >
                  {phone}
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold">Email</h3>
                <a href={`mailto:${email}`} className="mt-2 block text-foreground/80 hover:text-gold">
                  {email}
                </a>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gold">Business Hours</h3>
                <ul className="mt-2 space-y-1 text-foreground/80">
                  {hours.map((row) => (
                    <li key={row.label} className="flex max-w-xs justify-between gap-8">
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <BookButton bookingUrl={settings?.bookingUrl || undefined} label="Book Appointment" />
            </div>
            <div className="overflow-hidden rounded-sm border border-border">
              <iframe
                title="Milano Nail Spa location map"
                src="https://maps.google.com/maps?q=5801+Long+Prairie+Road+Suite+680+Flower+Mound+TX+75028&output=embed"
                className="h-[450px] w-full border-0 grayscale contrast-125"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="pb-8 text-center">
        <Link
          href="/blog/distinctive-features-of-milano-nail-spa-in-flower-mound"
          className="text-xs uppercase tracking-widest text-gold/70 hover:text-gold"
        >
          Read our featured story
        </Link>
      </div>
    </>
  )
}
