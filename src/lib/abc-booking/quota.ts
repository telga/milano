import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'

const QUOTA_PATH = join(process.cwd(), '.data', 'abc-submit-quota.json')

type QuotaFile = {
  date: string
  count: number
}

function chicagoDate(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago' }).format(new Date())
}

export function maxBookingsPerDay(): number {
  const parsed = Number(process.env.ABC_BOOKING_MAX_PER_DAY ?? '1')
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function readQuota(): QuotaFile {
  try {
    const raw = readFileSync(QUOTA_PATH, 'utf8')
    const parsed = JSON.parse(raw) as QuotaFile
    if (parsed.date === chicagoDate()) return parsed
  } catch {
    /* missing or invalid */
  }
  return { date: chicagoDate(), count: 0 }
}

function writeQuota(quota: QuotaFile) {
  mkdirSync(dirname(QUOTA_PATH), { recursive: true })
  writeFileSync(QUOTA_PATH, JSON.stringify(quota), 'utf8')
}

export function remainingBookingsToday(): { remaining: number; used: number; limit: number } {
  const limit = maxBookingsPerDay()
  const quota = readQuota()
  return { remaining: Math.max(0, limit - quota.count), used: quota.count, limit }
}

export function consumeBookingSlot(): { ok: true } | { ok: false; remaining: number; limit: number } {
  const limit = maxBookingsPerDay()
  const quota = readQuota()
  if (quota.count >= limit) {
    return { ok: false, remaining: 0, limit }
  }
  writeQuota({ date: chicagoDate(), count: quota.count + 1 })
  return { ok: true }
}

export function refundBookingSlot() {
  const quota = readQuota()
  writeQuota({ date: quota.date, count: Math.max(0, quota.count - 1) })
}
