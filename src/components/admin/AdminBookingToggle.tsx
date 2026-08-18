'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type AdminBookingToggleProps = {
  siteUrl: string
}

export default function AdminBookingToggle({ siteUrl }: AdminBookingToggleProps) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/api/globals/site-settings')
        if (!res.ok) throw new Error('Could not load booking settings')
        const data = (await res.json()) as { useCustomBookingFrontend?: boolean | null }
        if (!cancelled) {
          setEnabled(Boolean(data.useCustomBookingFrontend))
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setError('Could not load booking settings.')
          setLoading(false)
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const toggle = useCallback(async () => {
    const next = !enabled
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/globals/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCustomBookingFrontend: next }),
      })
      if (!res.ok) throw new Error('Save failed')
      setEnabled(next)
    } catch {
      setError('Could not save. Try again or use Website Misc → Booking.')
    } finally {
      setSaving(false)
    }
  }, [enabled])

  return (
    <section className="milano-admin-booking" aria-label="Booking page toggle">
      <div className="milano-admin-booking__copy">
        <p className="milano-admin-booking__eyebrow">Online booking</p>
        <h2 className="milano-admin-booking__title">
          {loading ? 'Loading…' : enabled ? 'Custom booking page is ON' : 'Custom booking page is OFF'}
        </h2>
        <p className="milano-admin-booking__desc">
          {enabled
            ? 'Visitors see the Milano-styled booking page. ABC Salon still handles the actual appointment.'
            : 'Book buttons open ABC Salon directly in a new tab — same as before.'}
        </p>
        <div className="milano-admin-booking__links">
          <a href={`${siteUrl}/book`} target="_blank" rel="noreferrer">
            Preview booking page
          </a>
          <Link href="/admin/globals/site-settings">Booking settings</Link>
        </div>
        {error && (
          <p className="milano-admin-booking__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        className={`milano-admin-booking__switch${enabled ? ' is-on' : ''}`}
        role="switch"
        aria-checked={enabled}
        aria-label="Use Milano booking page"
        disabled={loading || saving}
        onClick={() => void toggle()}
      >
        <span className="milano-admin-booking__switch-track" aria-hidden>
          <span className="milano-admin-booking__switch-thumb" />
        </span>
        <span className="milano-admin-booking__switch-label">
          {saving ? 'Saving…' : enabled ? 'ON' : 'OFF'}
        </span>
      </button>
    </section>
  )
}
