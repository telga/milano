import Image from 'next/image'
import { notFound } from 'next/navigation'

import { BookButton } from '@/components/BookButton'
import { RichTextRenderer } from '@/components/RichTextRenderer'
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

  return (
    <article>
      {post.featuredImage && (
        <div className="relative h-[45vh] w-full">
          <Image
            src={getMediaUrl(post.featuredImage)}
            alt={getMediaAlt(post.featuredImage, post.title)}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background/80" />
        </div>
      )}
      <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Blog</p>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-6 text-lg text-muted">{post.excerpt}</p>}
        <div className="mt-10">
          <RichTextRenderer content={post.content} />
        </div>
        <div className="mt-12">
          <BookButton bookingUrl={settings?.bookingUrl || undefined} />
        </div>
      </div>
    </article>
  )
}
