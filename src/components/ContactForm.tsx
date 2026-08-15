'use client'

import { useState } from 'react'

import { BUSINESS } from '@/lib/constants'

type ContactFormProps = {
  email?: string
  services?: string[]
}

export function ContactForm({ email = BUSINESS.email, services = [] }: ContactFormProps) {
  const [sent, setSent] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '')
    const service = String(data.get('service') || '')

    const body = [
      `Name: ${name}`,
      `Email: ${data.get('email') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Service of interest: ${service || 'Not specified'}`,
      '',
      String(data.get('message') || ''),
    ].join('\n')

    const subject = service ? `Inquiry: ${service}` : 'Website inquiry'
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="luxury-card p-5 sm:p-8">
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label className="field-label" htmlFor="contact-name">
            Full Name
          </label>
          <input id="contact-name" name="name" type="text" required className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="contact-email">
            Email Address
          </label>
          <input id="contact-email" name="email" type="email" required className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="contact-phone">
            Phone Number
          </label>
          <input id="contact-phone" name="phone" type="tel" className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="contact-service">
            Service of Interest
          </label>
          <select id="contact-service" name="service" className="field" defaultValue="">
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="contact-message">
            Message
          </label>
          <textarea id="contact-message" name="message" rows={4} className="field" />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 h-11 w-full bg-gold text-[11px] font-medium uppercase tracking-[0.24em] text-background transition-colors hover:bg-gold-light"
      >
        Send Message
      </button>

      {sent && (
        <p className="mt-4 text-xs text-muted" role="status">
          Your email draft is ready. If nothing opened, write to{' '}
          <a href={`mailto:${email}`} className="text-gold hover:underline">
            {email}
          </a>
          .
        </p>
      )}
    </form>
  )
}
