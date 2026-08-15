import Link from 'next/link'

import { BookButton } from '@/components/BookButton'
import { SocialLinks } from '@/components/SocialLinks'
import { BUSINESS, NAV_LINKS } from '@/lib/constants'
import type { SiteSetting } from '@/payload-types'

type FooterProps = {
  phone?: string
  email?: string
  address?: string
  bookingUrl?: string
  socialLinks?: SiteSetting['socialLinks']
}

export function Footer({
  phone = BUSINESS.phone,
  email = BUSINESS.email,
  address = BUSINESS.address,
  bookingUrl,
  socialLinks,
}: FooterProps) {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-luxury grid gap-10 py-14 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-2xl tracking-[0.16em] text-gold">MILANO NAIL SPA</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{BUSINESS.tagline}</p>
          <SocialLinks links={socialLinks} className="mt-6" />
          <div className="mt-6">
            <BookButton bookingUrl={bookingUrl} variant="outline" label="Book Appointment" />
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-gold">Explore</p>
          <ul className="space-y-2.5">
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
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-gold">Contact</p>
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

      <div className="border-t border-border py-5 text-center text-[11px] tracking-wide text-foreground/45">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  )
}
