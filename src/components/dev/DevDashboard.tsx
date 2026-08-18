import Link from 'next/link'

import type { MetricsSummary } from '@/lib/metrics/aggregate'
import { BOOKING_FUNNEL_STEPS } from '@/lib/metrics/types'
import { cn } from '@/lib/utils'

type DevDashboardProps = {
  summary: MetricsSummary
  generatedAt: string
  currentDay: string
  deploy: string | null
  environment: string
}

function pct(value: number | null): string {
  if (value == null) return '—'
  return `${Math.round(value * 100)}%`
}

function formatVital(name: string, value: number | null): string {
  if (value == null) return '—'
  if (name === 'CLS') return value.toFixed(3)
  return `${Math.round(value)} ms`
}

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0
  return (
    <div className="h-2 w-full bg-border/60">
      <div className="h-2 bg-gold" style={{ width: `${width}%` }} />
    </div>
  )
}

function Card({
  label,
  value,
  hint,
}: {
  label: string
  value: string | number
  hint?: string
}) {
  return (
    <div className="luxury-card p-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  )
}

export function DevDashboard({ summary, generatedAt, currentDay, deploy, environment }: DevDashboardProps) {
  const maxFunnel = Math.max(1, ...summary.funnel.map((row) => row.sessions))
  const maxVolume = Math.max(1, ...summary.volume.map((row) => row.count))
  const maxService = Math.max(1, ...summary.services.map((row) => row.count), 1)

  return (
    <div className="container-luxury py-10">
      <p className="eyebrow">Internal</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wide text-foreground sm:text-4xl">
            Dev dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            First-party counts for this site copy. Not Google Analytics, Sentry, or an uptime vendor.
            No names or phone numbers are stored.
          </p>
        </div>
        <div className="flex gap-2 text-[10px] uppercase tracking-[0.18em]">
          <Link
            href="?range=7"
            className={cn(
              'border px-3 py-2',
              summary.days === 7 ? 'border-gold text-gold' : 'border-border text-muted',
            )}
          >
            7 days
          </Link>
          <Link
            href="?range=30"
            className={cn(
              'border px-3 py-2',
              summary.days === 30 ? 'border-gold text-gold' : 'border-border text-muted',
            )}
          >
            30 days
          </Link>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted">
        Generated {generatedAt} · {currentDay} UTC · env {environment}
        {deploy ? ` · sha ${deploy}` : ''}
      </p>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card label="Page views" value={summary.visits} hint="Beacon on public pages" />
        <Card label="Unique sessions" value={summary.uniqueSessions} hint="24-hour anonymous cookie" />
        <Card
          label="Native submit success"
          value={pct(summary.submits.successRate)}
          hint={`${summary.submits.ok} ok / ${summary.submits.total} attempts`}
        />
        <Card
          label="ABC fallback"
          value={pct(summary.fallback.rate)}
          hint={`${summary.fallback.clicks} clicks · ${summary.fallback.forced} forced`}
        />
        <Card label="Tracked errors" value={summary.errors} hint="Booking APIs + browser errors" />
        <Card
          label="Admin"
          value={summary.adminLogins}
          hint={`${summary.adminSaves} Hours & Contact saves`}
        />
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-foreground">Booking funnel</h2>
        <p className="mt-1 text-xs text-muted">
          Unique sessions that reached each step. Drop-off is sessions that did not reach the next step.
        </p>
        <div className="mt-4 space-y-3">
          {summary.funnel.map((row, index) => (
            <div key={row.step}>
              <div className="mb-1 flex justify-between text-xs uppercase tracking-[0.16em]">
                <span>
                  {String(index + 1).padStart(2, '0')} {row.step.replace('-', ' ')}
                </span>
                <span className="text-muted">
                  {row.sessions} sessions
                  {index < BOOKING_FUNNEL_STEPS.length - 1
                    ? ` · ${row.dropoff} drop-off (${pct(row.dropoffRate)})`
                    : ''}
                </span>
              </div>
              <Bar value={row.sessions} max={maxFunnel} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl text-foreground">Successful bookings by day</h2>
        <p className="mt-1 text-xs text-muted">Native submits that ABC accepted.</p>
        <div className="mt-4 space-y-2">
          {summary.volume.map((row) => (
            <div key={row.day} className="grid grid-cols-[7rem_1fr_2rem] items-center gap-3 text-xs">
              <span className="text-muted">{row.day.slice(5)}</span>
              <Bar value={row.count} max={maxVolume} />
              <span className="text-right">{row.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-foreground">Top services</h2>
          <p className="mt-1 text-xs text-muted">Selected in the wizard (and successful submits).</p>
          <ul className="mt-4 space-y-2">
            {summary.services.length ? (
              summary.services.map((row) => (
                <li key={row.name}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{row.name}</span>
                    <span className="text-muted">{row.count}</span>
                  </div>
                  <Bar value={row.count} max={maxService} />
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">No selections yet.</li>
            )}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Top categories</h2>
          <ul className="mt-4 space-y-2">
            {summary.categories.length ? (
              summary.categories.map((row) => (
                <li key={row.name} className="flex justify-between text-sm">
                  <span>{row.name}</span>
                  <span className="text-muted">{row.count}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-muted">No categories yet.</li>
            )}
          </ul>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-xl text-foreground">Core Web Vitals (p75)</h2>
          <p className="mt-1 text-xs text-muted">From this site’s own beacons, not Search Console.</p>
          <dl className="mt-4 grid grid-cols-2 gap-3">
            {Object.entries(summary.vitals).map(([name, value]) => (
              <div key={name} className="luxury-card p-4">
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">{name}</dt>
                <dd className="mt-1 font-display text-2xl">{formatVital(name, value)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Health, deploys, errors</h2>
          <p className="mt-1 text-xs text-muted">
            Health samples when this page loads. Deploy IDs are Vercel SHAs seen on events — not the
            Vercel deploy API.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Health OK samples: {summary.healthOk}</li>
            <li>Health fail samples: {summary.healthFail}</li>
            <li>Tracked API error rate: {pct(summary.errorRate)}</li>
            <li>Submit disabled: {summary.submits.disabled}</li>
            <li>Submit quota blocked: {summary.submits.quota}</li>
            <li>Distinct deploys seen: {summary.deploys.length || '—'}</li>
            <li className="break-all text-muted">{summary.deploys.join(', ') || 'No SHA on local'}</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
