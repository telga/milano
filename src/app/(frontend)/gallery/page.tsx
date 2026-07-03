import { GalleryGrid } from '@/components/GalleryGrid'
import { PageHero } from '@/components/SiteImage'
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
      <PageHero
        title="Gallery"
        subtitle="Top Best Ever Finished"
        slot={slots['gallery-hero']}
      />
      <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <GalleryGrid items={items} />
      </section>
    </>
  )
}
