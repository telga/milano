import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { BookButton } from '@/components/BookButton'
import { SealBadge } from '@/components/SealBadge'
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
  const media = slot?.usePlaceholder ? null : slot?.image
  const src = getMediaUrl(media, fallbackSrc)
  const imageAlt = alt || getMediaAlt(media, slot?.label || 'Milano Nail Spa')
  const darkMedia = slot?.usePlaceholder ? null : slot?.darkModeImage
  const darkSrc = darkMedia ? getMediaUrl(darkMedia, src) : null

  return (
    <>
      <Image
        src={src}
        alt={imageAlt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={cn('object-cover', darkSrc && 'theme-image-light', className)}
      />
      {darkSrc && (
        <Image
          src={darkSrc}
          alt={alt || getMediaAlt(darkMedia, imageAlt)}
          fill={fill}
          priority={priority}
          sizes={sizes}
          className={cn('theme-image-dark object-cover', className)}
        />
      )}
    </>
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
    <Link href={href} className="group relative aspect-[4/5] overflow-hidden border border-border">
      <SlotImage slot={slot} fallbackSrc={fallbackSrc} sizes="(max-width:768px) 50vw, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--overlay-strong)] via-[var(--overlay)]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-display text-xl text-foreground transition-colors group-hover:text-gold">
          {title}
        </p>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        <span className="link-gold mt-3 opacity-0 transition-opacity group-hover:opacity-100">
          View Details <ArrowRight className="h-3 w-3" />
        </span>
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
        'relative flex items-end overflow-hidden border-b border-border',
        isCompact ? 'min-h-[15rem] max-h-[360px]' : 'min-h-[20rem] md:min-h-[52vh]',
      )}
    >
      <SlotImage slot={slot} fallbackSrc={fallbackSrc} priority sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--overlay-strong)] via-[var(--overlay)] to-transparent" />
      <div
        className={cn('container-luxury relative', isCompact ? 'py-10 md:py-16' : 'py-12 md:py-20')}
      >
        <h1
          className={cn(
            'max-w-3xl font-display text-foreground',
            isCompact ? 'text-[1.875rem] sm:text-4xl md:text-5xl' : 'text-3xl sm:text-4xl md:text-6xl',
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-muted sm:mt-4 sm:text-base md:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6 sm:mt-8">{children}</div>}
      </div>
    </section>
  )
}

/** Keeps the seal centred on the hero's vertical split. */
const SEAL_POSITION = 'absolute left-[1px] top-1/2 -translate-x-1/2 -translate-y-1/2'
const SEAL_SIZE = 'h-48 w-48 xl:h-56 xl:w-56'
const SEAL_SIZE_MOBILE = 'h-36 w-36 sm:h-44 sm:w-44'

type HomeHeroProps = {
  slot?: SiteImageSlot | null
  fallbackSrc?: string
  bookingHref: string
  servicesHref?: string
}

export function HomeHero({
  slot,
  fallbackSrc,
  bookingHref,
  servicesHref = '/services',
}: HomeHeroProps) {
  return (
    <section className="border-b border-border">
      <div className="relative grid lg:grid-cols-2">
        <div className="flex items-center px-5 py-12 sm:px-8 sm:py-16 lg:py-24 lg:pr-14 lg:[padding-left:max(2rem,calc((100vw-80rem)/2+2rem))]">
          <div className="w-full max-w-xl">
            <p className="eyebrow">Experience the Difference</p>
            <h1 className="mt-5 font-display text-[2.5rem] leading-[1.04] text-foreground sm:text-5xl md:text-6xl lg:text-[4.25rem]">
              <span className="block">Luxury</span>
              <span className="block">
                in <em className="not-italic text-gold md:italic">Every</em>
              </span>
              <span className="block">Detail.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted sm:mt-6 md:text-base">
              From meticulous technique to premium products, we deliver an unmatched nail
              experience.
            </p>
            <div className="mt-8 flex flex-col items-start gap-5 sm:mt-10">
              <BookButton
                bookingHref={bookingHref}
                size="lg"
                label="Book Appointment"
                variant="outline"
                className="w-full sm:w-auto"
              />
              <Link href={servicesHref} className="link-gold text-[11px]">
                View Services <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Photo + seam seal: desktop only */}
        <div className="relative hidden min-h-[42rem] border-l border-[color:var(--seam-line)] lg:block">
          <SlotImage
            slot={slot}
            fallbackSrc={fallbackSrc}
            priority
            sizes="(max-width:1024px) 100vw, 50vw"
          />

          <div className={cn('pointer-events-none z-20', SEAL_POSITION)}>
            <SealBadge className={SEAL_SIZE} />
          </div>
        </div>
      </div>

      {/* Mobile / tablet: seal under the copy, no hero photo */}
      <div className="flex justify-center pb-10 pt-2 sm:pb-12 lg:hidden">
        <SealBadge className={SEAL_SIZE_MOBILE} />
      </div>

      <div className="border-t border-border">
        <div className="container-luxury grid grid-cols-3 py-4 sm:py-5">
          {[
            { step: '01', label: 'Choose Service' },
            { step: '02', label: 'Select Time' },
            { step: '03', label: 'Relax & Enjoy' },
          ].map((item, index) => (
            <div
              key={item.step}
              className={cn(
                'flex flex-col items-center gap-1 text-center text-[9px] uppercase tracking-[0.2em] sm:flex-row sm:gap-3 sm:text-left sm:text-[10px] sm:tracking-[0.28em]',
                index > 0 && 'border-l border-border sm:pl-8',
              )}
            >
              <span className="font-display text-base tracking-normal text-gold">{item.step}</span>
              <span className="text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
