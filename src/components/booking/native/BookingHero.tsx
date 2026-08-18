import { SectionHeading } from '@/components/SectionHeading'

type BookingHeroProps = {
  phone?: string
}

export function BookingHero({ phone }: BookingHeroProps) {
  return (
    <section className="border-b border-border bg-surface section-pad">
      <div className="container-luxury">
        <SectionHeading
          as="h1"
          eyebrow="Book Online"
          title="Your Perfect Nails,"
          accent="Just a Few Clicks Away."
        />
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Choose your services, pick a time, and we&apos;ll confirm by text — powered by ABC Salon
          with a Milano experience.
          {phone ? (
            <>
              {' '}
              Questions? Call{' '}
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                className="text-gold transition-colors hover:text-gold-light"
              >
                {phone}
              </a>
              .
            </>
          ) : null}
        </p>
      </div>
    </section>
  )
}
