import { BookingIframe } from '@/components/booking/BookingIframe'
import { BookingIntro } from '@/components/booking/BookingIntro'
import { BookingStepBar } from '@/components/booking/BookingStepBar'
import { SectionHeading } from '@/components/SectionHeading'

type BookingFacadeProps = {
  abcBookingUrl: string
  phone?: string
  hours?: Array<{ label: string; value: string }> | null
}

export function BookingFacade({ abcBookingUrl, phone, hours }: BookingFacadeProps) {
  return (
    <>
      <section className="border-b border-border section-pad">
        <div className="container-luxury">
          <SectionHeading
            as="h1"
            eyebrow="Book Online"
            title="Reserve Your"
            accent="Appointment."
          />
          <div className="mt-6">
            <BookingIntro phone={phone} hours={hours} />
          </div>
        </div>
      </section>

      <BookingStepBar />

      <section className="section-pad">
        <div className="container-luxury">
          <div className="luxury-card overflow-hidden">
            <BookingIframe abcBookingUrl={abcBookingUrl} />
          </div>
          <p className="mt-6 text-center text-xs leading-relaxed text-muted">
            Appointments are confirmed by SMS from Milano Nail Spa. Need help sooner? Call us
            during business hours.
          </p>
        </div>
      </section>
    </>
  )
}
