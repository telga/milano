import Link from 'next/link'
import Image from 'next/image'

import { AnnouncementPopup } from '@/components/AnnouncementPopup'
import { BookButton } from '@/components/BookButton'
import { ClassicHome } from '@/components/ClassicHome'
import { BlogCardGrid } from '@/components/ContentCards'
import { FeatureTile, HomeHero, SlotImage } from '@/components/SiteImage'
import {
  getActiveHomePopup,
  getBlogPosts,
  getGalleryItems,
  getSiteSettings,
  getSlotsMapSafe,
} from '@/lib/data'
import { isClassicLayout } from '@/lib/constants'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata('Milano Nail Spa Flower Mound')

export default async function HomePage() {
  if (isClassicLayout()) {
    return <ClassicHome />
  }

  const [slots, settings, galleryPreview, blogPosts, popup] = await Promise.all([
    getSlotsMapSafe(),
    getSiteSettings().catch(() => null),
    getGalleryItems().catch(() => []),
    getBlogPosts().catch(() => []),
    getActiveHomePopup(),
  ])

  const aboutText = settings?.aboutText
  const logoUrl = settings?.logo ? getMediaUrl(settings.logo) : slots.logo?.image ? getMediaUrl(slots.logo.image) : undefined

  return (
    <>
      <AnnouncementPopup
        announcement={popup}
        siteLogoUrl={logoUrl}
        phone={settings?.phone || undefined}
      />
      <HomeHero
        slot={slots['home-hero']}
        bookingUrl={settings?.bookingUrl || undefined}
      />

      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureTile
            href="/promotions"
            title="Promotions"
            slot={slots['home-tile-promotions']}
          />
          <FeatureTile
            href="/specialties"
            title="Specialties"
            subtitle="Best Nail Design For You"
            slot={slots['home-tile-specialties']}
          />
          <FeatureTile
            href="/services"
            title="Services"
            subtitle="We Have Many Services"
            slot={slots['home-tile-services']}
          />
          <FeatureTile
            href="/gallery"
            title="Gallery"
            subtitle="Top Best Ever Finished"
            slot={slots['home-tile-gallery']}
          />
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">About Us</p>
            <h2 className="mt-4 font-display text-4xl text-foreground">About Milano Nail Spa</h2>
            <p className="mt-6 leading-relaxed text-muted">
              {aboutText ||
                'Our nail salon is dedicated to bringing top-of-the-line products mixed with expert techniques to the nail salon industry.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <BookButton bookingUrl={settings?.bookingUrl || undefined} />
              <Link
                href="/about"
                className="inline-flex h-11 items-center border border-slate/30 px-8 text-sm uppercase tracking-widest text-slate hover:bg-slate/5"
              >
                Learn More
              </Link>
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

      {galleryPreview.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold">Gallery</p>
                <h2 className="mt-2 font-display text-4xl text-foreground">Our Finest Work</h2>
              </div>
              <Link href="/gallery" className="text-xs uppercase tracking-widest text-gold">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {galleryPreview.slice(0, 4).map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-sm">
                  <Image
                    src={getMediaUrl(item.image)}
                    alt={getMediaAlt(item.image)}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="bg-surface py-20">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Blog</p>
            <h2 className="mt-2 mb-10 font-display text-4xl text-foreground">Latest Stories</h2>
            <BlogCardGrid posts={blogPosts.slice(0, 2)} />
          </div>
        </section>
      )}
    </>
  )
}
