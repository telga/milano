'use client'

type BookingDetailsStepProps = {
  name: string
  phone: string
  comment: string
  onChange: (fields: { name: string; phone: string; comment: string }) => void
}

export function BookingDetailsStep({ name, phone, comment, onChange }: BookingDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 04</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Your Details</h2>
        <p className="mt-2 text-sm text-muted">
          We&apos;ll text you to confirm — same as booking directly through ABC Salon.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field sm:col-span-2">
          <label htmlFor="booking-name" className="field-label">
            Full name
          </label>
          <input
            id="booking-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => onChange({ name: e.target.value, phone, comment })}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="field">
          <label htmlFor="booking-phone" className="field-label">
            Mobile phone
          </label>
          <input
            id="booking-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => onChange({ name, phone: e.target.value, comment })}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="field sm:col-span-2">
          <label htmlFor="booking-comment" className="field-label">
            Notes (optional)
          </label>
          <textarea
            id="booking-comment"
            rows={3}
            value={comment}
            onChange={(e) => onChange({ name, phone, comment: e.target.value })}
            className="w-full border border-border bg-background px-3 py-2 text-sm"
            placeholder="Special requests, design ideas, etc."
          />
        </div>
      </div>
    </div>
  )
}
