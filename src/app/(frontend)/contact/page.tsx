import { BookButton } from '@/components/BookButton'
import { PageHero } from '@/components/SiteImage'
import { BUSINESS } from '@/lib/constants'
import { getSiteSettings, getSlotsMapSafe } from '@/lib/data'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

export const metadata = buildPageMetadata(
  'Contact',
  'Visit Milano Nail Spa at 5801 Long Prairie Road, Flower Mound, TX. Call (214) 513-4800.',
)

export default async function ContactPage() {
  const [settings, slots] = await Promise.all([
    getSiteSettings().catch(() => null),
    getSlotsMapSafe(),
  ])

  const phone = settings?.phone || BUSINESS.phone
  const email = settings?.email || BUSINESS.email
  const address = settings?.address || BUSINESS.address
  const hours = settings?.hours || [
    { label: 'Mon – Sat', value: '9:00 AM – 7:00 PM' },
    { label: 'Sunday', value: '10:00 AM – 5:00 PM' },
  ]

  return (
    <>
      <PageHero title="Contact" subtitle="For any inquiries" slot={slots['contact-hero']} />
      <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gold">Store Location</h2>
              <p className="mt-2 text-muted">{address}</p>
              <a
                href={BUSINESS.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-gold hover:underline"
              >
                Get Directions
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gold">Phone</h2>
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="mt-2 block text-muted hover:text-gold">
                {phone}
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gold">Email</h2>
              <a href={`mailto:${email}`} className="mt-2 block text-muted hover:text-gold">
                {email}
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-widest text-gold">Business Hours</h2>
              <ul className="mt-2 space-y-1 text-muted">
                {hours.map((row) => (
                  <li key={row.label} className="flex justify-between gap-8 max-w-xs">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <BookButton bookingUrl={settings?.bookingUrl || undefined} label="Book Appointment" />
          </div>

          <div className="overflow-hidden rounded-sm border border-border">
            <iframe
              title="Milano Nail Spa location map"
              src="https://maps.google.com/maps?q=5801+Long+Prairie+Road+Suite+680+Flower+Mound+TX+75028&output=embed"
              className="h-[450px] w-full border-0 grayscale contrast-125"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  )
}
