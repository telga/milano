import { ArrowRight, Clock, Mail, MapPin, Phone } from 'lucide-react'

import { BookButton } from '@/components/BookButton'
import { ContactForm } from '@/components/ContactForm'
import { PageHero } from '@/components/SiteImage'
import { SectionHeading } from '@/components/SectionHeading'
import { SocialLinks } from '@/components/SocialLinks'
import { BUSINESS } from '@/lib/constants'
import { getServiceCategories, getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Contact',
  'Visit Milano Nail Spa at 5801 Long Prairie Road, Flower Mound, TX. Call (214) 513-4800.',
)

export default async function ContactPage() {
  const [settings, slots, categories] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
    getServiceCategories().catch(() => []),
  ])

  const phone = settings?.phone || BUSINESS.phone
  const email = settings?.email || BUSINESS.email
  const address = settings?.address || BUSINESS.address
  const hours = settings?.hours || [
    { label: 'Mon – Sat', value: '9:00 AM – 7:00 PM' },
    { label: 'Sunday', value: '10:00 AM – 5:00 PM' },
  ]

  const serviceNames = categories.map((category) => category.name)

  return (
    <>
      <PageHero title="Get in Touch" subtitle="For any inquiries" slot={slots['contact-hero']} />

      <section className="section-pad">
        <div className="container-luxury grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div>
            <SectionHeading as="h2" title="Send a" accent="Message." />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Prefer to write first? Tell us how we can help and we&apos;ll get back to you.
            </p>
            <div className="mt-8">
              <ContactForm email={email} services={serviceNames} />
            </div>
          </div>

          <aside className="luxury-card overflow-hidden">
            <div className="space-y-8 p-5 sm:p-8">
              <div>
                <SectionHeading as="h2" title="Visit" accent="Us." />
                <ul className="mt-6 space-y-5 text-sm text-muted">
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <a href={`tel:${phone.replace(/\D/g, '')}`} className="hover:text-gold">
                      {phone}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <a href={`mailto:${email}`} className="hover:text-gold">
                      {email}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <div>
                      <p>{address}</p>
                      <a
                        href={BUSINESS.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-2 text-gold hover:underline"
                      >
                        Get Directions <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </li>
                </ul>
                <SocialLinks links={settings?.socialLinks} className="mt-6" />
              </div>

              <div className="border-t border-border pt-8">
                <div className="mb-5 flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gold" aria-hidden />
                  <h3 className="text-[11px] uppercase tracking-[0.28em] text-gold">Business Hours</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted">
                  {hours.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between gap-8 border-b border-border pb-3 last:border-b-0"
                    >
                      <span>{row.label}</span>
                      <span>{row.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <BookButton
                    bookingUrl={settings?.bookingUrl || undefined}
                    label="Book Appointment"
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-border">
              <iframe
                title="Milano Nail Spa location map"
                src="https://maps.google.com/maps?q=5801+Long+Prairie+Road+Suite+680+Flower+Mound+TX+75028&output=embed"
                className="h-[16rem] w-full border-0 grayscale contrast-125 sm:h-[20rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
