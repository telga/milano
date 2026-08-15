'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Droplet,
  Droplets,
  Flower2,
  Footprints,
  Gem,
  Hand,
  Heart,
  Layers,
  Palette,
  Plus,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

import type { ServiceCategory } from '@/payload-types'
import { cn, slugify } from '@/lib/utils'

type GridItem = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const FALLBACK_CATEGORIES: Array<{ name: string; description: string }> = [
  { name: 'Manicure', description: 'Classic to luxury manicures tailored to perfection.' },
  { name: 'Gel Manicure', description: 'Long-lasting shine with premium gel polishes.' },
  { name: 'Pedicure', description: 'Relaxing pedicures for healthy, beautiful feet.' },
  { name: 'Gel Pedicure', description: 'Durable gel finish that keeps your feet flawless.' },
  { name: 'Nail Enhancements', description: 'Acrylic, builder gel & more for stunning results.' },
  { name: 'Nail Art', description: 'Custom nail art designed to express your style.' },
  { name: 'Additionals', description: 'Add-on services to elevate your experience.' },
  { name: 'Kids Services', description: 'Special care for our little guests.' },
]

const FALLBACK_DESCRIPTIONS = new Map(
  FALLBACK_CATEGORIES.map((item) => [item.name.toLowerCase(), item.description]),
)

function iconFor(name: string): LucideIcon {
  const key = name.toLowerCase()
  if (key.includes('pedicure')) return key.includes('gel') ? Droplets : Footprints
  if (key.includes('manicure')) return key.includes('gel') ? Droplet : Hand
  if (key.includes('art') || key.includes('design')) return Palette
  if (key.includes('acrylic') || key.includes('enhance') || key.includes('extension')) return Layers
  if (key.includes('kid') || key.includes('child')) return Heart
  if (key.includes('add') || key.includes('extra')) return Plus
  if (key.includes('wax') || key.includes('lash') || key.includes('brow')) return Flower2
  if (key.includes('special') || key.includes('luxury')) return Sparkles
  return Gem
}

type ServiceIconGridProps = {
  categories?: ServiceCategory[]
  basePath?: string
  hideIcons?: boolean
}

function categoryHref(basePath: string, slug: string) {
  if (basePath.includes('#')) return `/#cat-${slug}`
  return `${basePath}#cat-${slug}`
}

export function ServiceIconGrid({
  categories,
  basePath = '/services',
  hideIcons = false,
}: ServiceIconGridProps) {
  const items: GridItem[] = categories?.length
    ? categories.map((category) => ({
        title: category.name,
        description:
          category.description || FALLBACK_DESCRIPTIONS.get(category.name.toLowerCase()) || '',
        href: categoryHref(basePath, category.slug || slugify(category.name)),
        icon: iconFor(category.name),
      }))
    : FALLBACK_CATEGORIES.map((item) => ({
        title: item.name,
        description: item.description,
        href: categoryHref(basePath, slugify(item.name)),
        icon: iconFor(item.name),
      }))

  return (
    <div className="hairline-grid grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const hash = item.href.includes('#') ? item.href.split('#')[1] : null

        return (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              'hairline-cell group flex cursor-pointer flex-col items-center px-4 py-6 text-center transition-colors hover:bg-surface sm:px-5 sm:py-8',
              hideIcons && 'justify-center',
            )}
            onClick={() => {
              if (!hash?.startsWith('cat-')) return
              window.dispatchEvent(
                new CustomEvent('milano:open-service', { detail: { hash } }),
              )
            }}
          >
            {!hideIcons && (
              <item.icon className="h-5 w-5 text-gold sm:h-6 sm:w-6" aria-hidden />
            )}
            <p
              className={cn(
                'w-full text-center text-[10px] uppercase tracking-[0.18em] text-foreground sm:text-[11px] sm:tracking-[0.22em]',
                !hideIcons && 'mt-3 sm:mt-4',
              )}
            >
              {item.title}
            </p>
            {item.description && (
              <p className="mt-2 w-full text-center text-[11px] leading-relaxed text-muted sm:mt-3 sm:text-xs">
                {item.description}
              </p>
            )}
            <span className="link-gold mt-4 justify-center sm:mt-5">
              View Details <ArrowRight className="h-3 w-3" aria-hidden />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
