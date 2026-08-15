import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { BlogPost, Promotion, Specialty } from '@/payload-types'

export function ContentCardGrid({
  items,
}: {
  items: Array<Promotion | Specialty>
  basePath?: '/promotions' | '/specialties'
}) {
  if (!items.length) return null

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="luxury-card overflow-hidden">
          {item.image && (
            <div className="relative aspect-[4/3]">
              <Image
                src={getMediaUrl(item.image)}
                alt={getMediaAlt(item.image, item.title)}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 33vw"
              />
            </div>
          )}
          <div className="p-5 sm:p-6">
            <div className="gold-rule mb-4" />
            <h2 className="font-display text-xl text-foreground">{item.title}</h2>
            {'subtitle' in item && item.subtitle && (
              <p className="mt-1 text-sm text-gold/90">{item.subtitle}</p>
            )}
            {item.body && <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>}
          </div>
        </article>
      ))}
    </div>
  )
}

export function BlogCardGrid({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return <p className="text-muted">No blog posts yet.</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {posts.map((post) => (
        <article key={post.id} className="group luxury-card overflow-hidden">
          {post.featuredImage && (
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={getMediaUrl(post.featuredImage)}
                alt={getMediaAlt(post.featuredImage, post.title)}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
            </div>
          )}
          <div className="p-5 sm:p-6">
            <h2 className="font-display text-xl text-foreground transition-colors group-hover:text-gold sm:text-2xl">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
            )}
            <Link
              href={`/blog/${post.slug}`}
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-gold"
            >
              Read More <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
}
