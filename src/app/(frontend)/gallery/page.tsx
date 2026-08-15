import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { GalleryGrid } from '@/components/GalleryGrid'
import { PageHero } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { getGalleryItems, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Gallery',
  'Nail art, designs, and salon photos from Milano Nail Spa Flower Mound.',
)

export default async function GalleryPage() {
  const [items, slots] = await Promise.all([
    getGalleryItems().catch(() => []),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <PageHero title="Gallery" subtitle="Top Best Ever Finished" slot={slots['gallery-hero']} />
      <section className="section-pad">
        <div className="container-luxury">
          <SectionHeading
            title="Artistry. Luxury."
            accent="You."
            align="center"
            className="mb-10"
          />
          <GalleryGrid items={items} showFilters />
          {items.length > 0 && (
            <div className="mt-10 text-center">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 border border-gold px-8 text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
              >
                Book Your Look <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
