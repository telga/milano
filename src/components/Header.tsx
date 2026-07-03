'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BookButton } from '@/components/BookButton'
import { CLASSIC_LAYOUT, NAV_LINKS, navHref } from '@/lib/constants'
import { cn } from '@/lib/utils'

type HeaderProps = {
  logoUrl?: string
  bookingUrl?: string
}

export function Header({ logoUrl, bookingUrl }: HeaderProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const classic = CLASSIC_LAYOUT

  useEffect(() => {
    if (!classic || pathname !== '/') return
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = ''
    }
  }, [classic, pathname])

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
      'text-xs uppercase tracking-widest transition-colors hover:text-gold',
      isActive(link) ? 'text-gold' : 'text-foreground/80',
    )

  const handleNavClick = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link href={classic ? '/' : '/'} className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Milano Nail Spa" className="h-12 w-12 object-contain" />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold font-display text-xl text-gold">
              M
            </span>
          )}
          <div className="hidden sm:block">
            <p className="font-display text-sm tracking-[0.2em] text-slate">MILANO</p>
            <p className="text-xs tracking-widest text-gold/80">FLOWER MOUND</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={navHref(link, classic)} className={linkClass(link)}>
              {link.label}
            </Link>
          ))}
          <BookButton bookingUrl={bookingUrl} size="sm" label="Appointment" variant="slate" />
        </nav>

        <button
          type="button"
          className="text-slate lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-6 lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={navHref(link, classic)}
                  onClick={handleNavClick}
                  className={cn('block text-sm uppercase tracking-widest', linkClass(link))}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <BookButton bookingUrl={bookingUrl} className="w-full" variant="slate" />
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
