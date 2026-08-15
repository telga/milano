'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { GalleryItem } from '@/payload-types'
import { cn } from '@/lib/utils'

type GalleryGridProps = {
  items: GalleryItem[]
  className?: string
  showFilters?: boolean
  limit?: number
}

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Manicure', value: 'manicure' },
  { label: 'Pedicure', value: 'pedicure' },
  { label: 'Nail Art', value: 'nail-art' },
  { label: 'Enhancements', value: 'enhancements' },
] as const

function matchesFilter(item: GalleryItem, filter: string) {
  if (filter === 'all') return true
  const haystack = `${item.category || ''} ${item.caption || ''}`.toLowerCase()
  if (filter === 'nail-art') return haystack.includes('nail') || haystack.includes('art') || item.category === 'nail-art'
  if (filter === 'manicure') return haystack.includes('mani')
  if (filter === 'pedicure') return haystack.includes('pedi')
  if (filter === 'enhancements') {
    return (
      haystack.includes('acrylic') ||
      haystack.includes('enhance') ||
      haystack.includes('extension') ||
      haystack.includes('dip')
    )
  }
  return true
}

export function GalleryGrid({
  items,
  className,
  showFilters = false,
  limit,
}: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    const next = showFilters ? items.filter((item) => matchesFilter(item, filter)) : items
    return typeof limit === 'number' ? next.slice(0, limit) : next
  }, [items, filter, showFilters, limit])

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [activeIndex])

  if (!items.length) {
    return <p className="text-center text-muted">Gallery photos coming soon.</p>
  }

  return (
    <>
      {showFilters && (
        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:mb-10 sm:gap-x-6">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={cn(
                'border-b pb-1 text-[10px] uppercase tracking-[0.24em] transition-colors',
                filter === item.value
                  ? 'border-gold text-gold'
                  : 'border-transparent text-muted hover:text-gold',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-center text-muted">No gallery photos in this category yet.</p>
      ) : (
        <div className={cn('grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3', className)}>
          {filtered.map((item, index) => {
            const src = getMediaUrl(item.image)
            const alt = getMediaAlt(item.image, item.caption || 'Gallery image')
            return (
              <button
                key={item.id}
                type="button"
                className="relative aspect-square overflow-hidden border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                onClick={() => setActiveIndex(index)}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width:768px) 50vw, 33vw"
                />
              </button>
            )
          })}
        </div>
      )}

      {activeIndex !== null && filtered[activeIndex] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white hover:text-gold"
            onClick={() => setActiveIndex(null)}
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          <Image
            src={getMediaUrl(filtered[activeIndex].image)}
            alt={getMediaAlt(filtered[activeIndex].image)}
            width={1200}
            height={1600}
            className="max-h-[90vh] w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
