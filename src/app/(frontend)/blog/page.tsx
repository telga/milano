import { BlogCardGrid } from '@/components/ContentCards'
import { PageHero } from '@/components/SiteImage'
import { getBlogPosts, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata('Blog', 'News and stories from Milano Nail Spa Flower Mound.')

export default async function BlogPage() {
  const [posts, slots] = await Promise.all([
    getBlogPosts().catch(() => []),
    getSlotsMapSafe(),
  ])

  return (
    <>
      <PageHero title="Blog" subtitle="Stories from Milano Nail Spa" slot={slots['blog-hero']} />
      <section className="section-pad">
        <div className="container-luxury">
          <BlogCardGrid posts={posts} />
        </div>
      </section>
    </>
  )
}
