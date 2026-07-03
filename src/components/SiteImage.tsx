import Image from 'next/image'
import Link from 'next/link'

import { BookButton } from '@/components/BookButton'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { SiteImageSlot } from '@/payload-types'
import { cn } from '@/lib/utils'

type SlotImageProps = {
  slot?: SiteImageSlot | null
  fallbackSrc?: string
  alt?: string
  className?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
}

export function SlotImage({
  slot,
  fallbackSrc = '/images/placeholder.svg',
  alt,
  className,
  fill = true,
  priority,
  sizes = '100vw',
}: SlotImageProps) {
  const media = slot?.image
  const src = getMediaUrl(media, fallbackSrc)
  const imageAlt = alt || getMediaAlt(media, slot?.label || 'Milano Nail Spa')

  return (
    <Image
      src={src}
      alt={imageAlt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={cn('object-cover', className)}
    />
  )
}

type FeatureTileProps = {
  href: string
  title: string
  subtitle?: string
  slot?: SiteImageSlot | null
  fallbackSrc?: string
}

export function FeatureTile({ href, title, subtitle, slot, fallbackSrc }: FeatureTileProps) {
  return (
    <Link
      href={href}
      className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-border"
    >
      <SlotImage slot={slot} fallbackSrc={fallbackSrc} sizes="(max-width:768px) 50vw, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-display text-xl text-slate group-hover:text-gold">{title}</p>
        {subtitle && <p className="mt-1 text-sm text-foreground/70">{subtitle}</p>}
      </div>
    </Link>
  )
}

type PageHeroProps = {
  title: string
  subtitle?: string
  slot?: SiteImageSlot | null
  fallbackSrc?: string
  children?: React.ReactNode
  size?: 'compact' | 'full'
}

export function PageHero({
  title,
  subtitle,
  slot,
  fallbackSrc,
  children,
  size = 'compact',
}: PageHeroProps) {
  const isCompact = size === 'compact'

  return (
    <section
      className={cn(
        'relative flex items-end overflow-hidden',
        isCompact ? 'min-h-[28vh] max-h-[360px]' : 'min-h-[50vh]',
      )}
    >
      <SlotImage slot={slot} fallbackSrc={fallbackSrc} priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
      <div
        className={cn(
          'relative mx-auto w-full max-w-7xl px-4 lg:px-8',
          isCompact ? 'py-12 md:py-16' : 'py-20',
        )}
      >
        <h1
          className={cn(
            'max-w-3xl font-display text-slate',
            isCompact ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl',
          )}
        >
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-foreground/80">{subtitle}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}

type HomeHeroProps = {
  slot?: SiteImageSlot | null
  fallbackSrc?: string
  bookingUrl?: string
}

export function HomeHero({ slot, fallbackSrc, bookingUrl }: HomeHeroProps) {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <SlotImage slot={slot} fallbackSrc={fallbackSrc} priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-4 lg:px-8">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-gold">Flower Mound, Texas</p>
        <h1 className="max-w-2xl font-display text-5xl leading-tight text-slate md:text-7xl">
          Milano Nail Spa
        </h1>
        <p className="mt-4 max-w-lg text-lg text-foreground/80">
          Where glamour meets exquisite nail care in an elegant, relaxing atmosphere.
        </p>
        <div className="mt-10">
          <BookButton bookingUrl={bookingUrl} size="lg" />
        </div>
      </div>
    </section>
  )
}
