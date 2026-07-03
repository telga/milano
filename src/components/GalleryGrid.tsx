'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X } from 'lucide-react'

import { getMediaAlt, getMediaUrl } from '@/lib/media'
import type { GalleryItem } from '@/payload-types'
import { cn } from '@/lib/utils'

type GalleryGridProps = {
  items: GalleryItem[]
  className?: string
}

export function GalleryGrid({ items, className }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  if (!items.length) {
    return (
      <p className="text-center text-muted">Gallery photos coming soon.</p>
    )
  }

  return (
    <>
      <div className={cn('columns-1 gap-4 sm:columns-2 lg:columns-3', className)}>
        {items.map((item, index) => {
          const src = getMediaUrl(item.image)
          const alt = getMediaAlt(item.image, item.caption || 'Gallery image')
          return (
            <button
              key={item.id}
              type="button"
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-sm border border-border focus:outline-none focus:ring-2 focus:ring-gold/50"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={src}
                alt={alt}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          )
        })}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-surface hover:text-gold"
            onClick={() => setActiveIndex(null)}
            aria-label="Close lightbox"
          >
            <X className="h-8 w-8" />
          </button>
          <Image
            src={getMediaUrl(items[activeIndex].image)}
            alt={getMediaAlt(items[activeIndex].image)}
            width={1200}
            height={1600}
            className="max-h-[90vh] w-auto object-contain"
          />
        </div>
      )}
    </>
  )
}
