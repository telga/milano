import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookButton } from '@/components/BookButton'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { resolveBookingHref } from '@/lib/booking'
import { getBlogPostBySlug, getSiteSettings } from '@/lib/data'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return buildPageMetadata('Blog Post')
  return buildPageMetadata(post.title, post.excerpt || undefined)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [post, settings] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteSettings().catch(() => null),
  ])

  if (!post) notFound()

  const bookingHref = resolveBookingHref(settings)

  return (
    <article>
      {post.featuredImage && (
        <div className="relative h-[15rem] w-full border-b border-border sm:h-[42vh]">
          <Image
            src={getMediaUrl(post.featuredImage)}
            alt={getMediaAlt(post.featuredImage, post.title)}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--overlay)]/30 to-[var(--overlay-strong)]" />
        </div>
      )}
      <div className="container-luxury max-w-3xl py-12 md:py-16">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 font-display text-[1.875rem] text-foreground sm:mt-4 sm:text-4xl md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-5 text-muted sm:mt-6 sm:text-lg">{post.excerpt}</p>}
        <div className="mt-10">
          <RichTextRenderer content={post.content} />
        </div>
        <div className="mt-12">
          <BookButton bookingHref={bookingHref} label="Book Appointment" />
        </div>
      </div>
    </article>
  )
}
