import Link from 'next/link'

import { BookButton } from '@/components/BookButton'
import { BUSINESS, NAV_LINKS } from '@/lib/constants'

type FooterProps = {
  phone?: string
  email?: string
  address?: string
  bookingUrl?: string
}

export function Footer({
  phone = BUSINESS.phone,
  email = BUSINESS.email,
  address = BUSINESS.address,
  bookingUrl,
}: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl text-gold">{BUSINESS.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{BUSINESS.tagline}</p>
          <div className="mt-6">
            <BookButton bookingUrl={bookingUrl} variant="outline" />
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-gold">Explore</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-widest text-gold">Contact</p>
          <ul className="space-y-3 text-sm text-muted">
            <li>{address}</li>
            <li>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-gold">
                {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="hover:text-gold">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6 text-center text-xs text-foreground/50">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  )
}
