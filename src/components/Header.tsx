'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BookButton } from '@/components/BookButton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { resolveBookingHref } from '@/lib/booking'
import { CLASSIC_LAYOUT, NAV_LINKS, navHref } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { SiteSetting } from '@/payload-types'

type HeaderProps = {
  bookingHref?: string
  hiddenNavigationItems?: SiteSetting['hiddenNavigationItems']
}

export function Header({ bookingHref, hiddenNavigationItems }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const classic = CLASSIC_LAYOUT
  const visibleLinks = NAV_LINKS.filter(
    (link) => !hiddenNavigationItems?.includes(link.anchor),
  )

  useEffect(() => {
    if (!classic || pathname !== '/') return
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [classic, pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (link: (typeof NAV_LINKS)[number]) => {
    if (classic && pathname === '/') {
      if (typeof window === 'undefined') return link.anchor === 'home'
      const hash = window.location.hash.replace('#', '')
      if (link.anchor === 'home') return !hash
      return hash === link.anchor
    }
    return pathname === link.href
  }

  const linkClass = (link: (typeof NAV_LINKS)[number]) =>
    cn(
      'whitespace-nowrap text-[10px] uppercase tracking-[0.24em] transition-colors hover:text-gold',
      isActive(link) ? 'text-gold' : 'text-foreground/70',
    )

  const bookHref = bookingHref || resolveBookingHref(null)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
      <div className="container-luxury grid grid-cols-[1fr_auto] items-center gap-3 py-3 sm:py-4 xl:grid-cols-[auto_1fr_auto]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold font-display text-base text-gold sm:h-10 sm:w-10 sm:text-lg">
            M
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[13px] font-semibold tracking-[0.18em] text-gold sm:text-[15px] sm:tracking-[0.22em]">
              MILANO NAIL SPA
            </p>
            <p className="hidden text-[9px] tracking-[0.28em] text-muted sm:block">FLOWER MOUND</p>
          </div>
        </Link>

        <nav
          className="hidden flex-nowrap items-center justify-center gap-x-4 xl:flex 2xl:gap-x-6"
          aria-label="Main"
        >
          {visibleLinks.map((link) => (
            <Link key={link.href} href={navHref(link, classic)} className={linkClass(link)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden sm:block">
            <BookButton bookingHref={bookHref} size="sm" label="Book Now" />
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:border-gold hover:text-gold xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-6 xl:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={navHref(link, classic)}
                  onClick={() => setOpen(false)}
                  className={cn('block text-sm uppercase tracking-[0.22em]', linkClass(link))}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 sm:hidden">
              <BookButton bookingHref={bookHref} className="w-full" label="Book Now" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
