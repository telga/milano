'use client'

import { useEffect, useState } from 'react'

import { getMediaUrl } from '@/lib/media'
import type { PopupAnnouncement } from '@/payload-types'

type Props = {
  announcement: PopupAnnouncement | null
  siteLogoUrl?: string
  phone?: string
}

function storageKey(announcement: PopupAnnouncement) {
  const version = announcement.updatedAt || String(announcement.id)
  return `milano-popup-dismissed-${announcement.id}-${version}`
}

export function AnnouncementPopup({ announcement, siteLogoUrl, phone }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!announcement) return
    try {
      const dismissed = localStorage.getItem(storageKey(announcement))
      if (!dismissed) setVisible(true)
    } catch {
      setVisible(true)
    }
  }, [announcement])

  if (!announcement || !visible) return null

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey(announcement), '1')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  const logoSrc = announcement.logo
    ? getMediaUrl(announcement.logo)
    : siteLogoUrl

  const paragraphs = announcement.body.split(/\n\n+/).filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-announcement-title"
      onClick={dismiss}
      onKeyDown={(e) => e.key === 'Escape' && dismiss()}
    >
      <article
        className="relative max-h-[90vh] w-full max-w-2xl cursor-pointer overflow-y-auto border border-gold/60 bg-surface shadow-2xl shadow-slate/20"
        onClick={dismiss}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <span className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-gold/70" />
        <span className="pointer-events-none absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-gold/70" />
        <span className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-gold/70" />

        <div
          className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-tl from-gold via-gold-light to-gold/80 opacity-90"
          style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
          aria-hidden
        />

        <div className="relative px-6 py-10 sm:px-10 sm:py-12">
          {logoSrc && (
            <div className="absolute right-6 top-6 flex flex-col items-center gap-1 sm:right-10 sm:top-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoSrc} alt="" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              {phone && (
                <p className="text-[10px] tracking-wider text-gold/90">{phone}</p>
              )}
              {announcement.instagramHandle && (
                <p className="text-[10px] text-muted">{announcement.instagramHandle}</p>
              )}
            </div>
          )}

          <p className="text-center text-xs tracking-[0.35em] text-gold/80">Click anywhere to close</p>

          <h2
            id="popup-announcement-title"
            className="mt-6 text-center font-display text-2xl tracking-[0.15em] text-gold sm:text-3xl"
          >
            {announcement.headline}
          </h2>

          <div className="mt-8 space-y-4 text-center text-sm leading-relaxed text-foreground/90 sm:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>

          {announcement.highlightLine && (
            <p className="mt-6 text-center font-display text-lg text-gold sm:text-xl">
              {announcement.highlightLine}
            </p>
          )}

          {announcement.signature && (
            <p className="mt-10 whitespace-pre-line text-center font-display text-xl italic text-gold/90 sm:text-2xl">
              {announcement.signature}
            </p>
          )}
        </div>
      </article>
    </div>
  )
}
