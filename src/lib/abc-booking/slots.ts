import type { TimeBand } from '@/lib/abc-booking/types'

export type ShopHoursByDay = Record<number, { from: string; to: string }>

export type ShopHolidayMap = Record<string, 'closed' | { from?: string; to?: string }>

export type OccupancyAppointment = {
  hour?: string
  duration?: number | null
  option?: string | null
}

export type SlotComputeInput = {
  dateIso: string
  now?: Date
  durationMinutes: number
  hoursByDay: ShopHoursByDay
  holidays?: ShopHolidayMap
  withinHours?: number
  maxAppHour?: number
  weeklyMaxApp?: Record<number, number>
  disable15?: boolean
  disable30?: boolean
  disable45?: boolean
  shopAppointments?: OccupancyAppointment[]
  guestCount?: number
}

export type ComputedSlot = {
  time: string
  hour: number
  minute: number
  band: TimeBand
}

const TIME_RE = /(\d+):(\d+)\s*(AM|PM)/i

export function parseIsoDateLocal(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export function toAbcDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return `${month}/${day}/${year}`
}

export function localDateIso(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function abcWeekday(date: Date): number {
  return date.getDay() + 1
}

export function bandForHour(hour: number): TimeBand {
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

export function formatTimeLabel(hours: number, minutes: number): string {
  const ampm = hours < 12 ? 'AM' : 'PM'
  const h12 = hours % 12 || 12
  return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`
}

export function parseHour12(text: string): { hours: number; minutes: number } | null {
  const parts = text.match(TIME_RE)
  if (!parts) return null
  let hours = Number(parts[1])
  const minutes = Number(parts[2])
  const tt = parts[3].toUpperCase()
  if (tt === 'PM' && hours !== 12) hours += 12
  if (tt === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

export function buildHourOccupancy(appointments: OccupancyAppointment[]): number[] {
  const occupancy = Array.from({ length: 24 }, () => 0)

  for (const app of appointments) {
    if (!app.hour) continue
    const parsed = parseHour12(app.hour)
    if (!parsed) continue

    let increase = 1
    if (app.option) {
      try {
        const option = JSON.parse(app.option) as { num_cust?: string | number }
        const n = Number(option.num_cust)
        if (Number.isFinite(n) && n > 0) increase = n
      } catch {
        /* ignore malformed option */
      }
    }

    let duration = app.duration ?? parsed.minutes
    if (app.duration != null) duration = app.duration + parsed.minutes - 1
    if (duration < 0) duration = 0

    const extra = duration / 60
    for (let i = 0; i <= extra && parsed.hours + i < 24; i += 1) {
      occupancy[parsed.hours + i] += increase
    }
  }

  return occupancy
}

function holidayKey(date: Date): { full: string; short: string } {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return { full: `${m}/${d}/${date.getFullYear()}`, short: `${m}/${d}` }
}

export function computeAvailableSlots(input: SlotComputeInput): {
  open: boolean
  hours?: { from: string; to: string }
  slots: ComputedSlot[]
} {
  const pick = parseIsoDateLocal(input.dateIso)
  pick.setHours(0, 0, 0, 0)
  const weekday = abcWeekday(pick)
  const holidays = input.holidays || {}
  const { full, short } = holidayKey(pick)
  const holiday = holidays[full] ?? holidays[short]

  if (holiday === 'closed') {
    return { open: false, slots: [] }
  }

  const dayHours =
    holiday && typeof holiday === 'object'
      ? { from: holiday.from, to: holiday.to }
      : input.hoursByDay[weekday]

  if (!dayHours?.from || !dayHours?.to) {
    return { open: false, slots: [] }
  }

  const openAt = parseHour12(dayHours.from)
  const closeAt = parseHour12(dayHours.to)
  if (!openAt || !closeAt) {
    return { open: false, hours: { from: dayHours.from, to: dayHours.to }, slots: [] }
  }

  const duration = Math.max(input.durationMinutes || 15, 15)
  const occupancy = buildHourOccupancy(input.shopAppointments || [])
  const extraGuests = Math.max(0, (input.guestCount ?? 1) - 1)
  const maxApp =
    input.weeklyMaxApp?.[weekday] ??
    input.maxAppHour ??
    100

  const now = input.now ?? new Date()
  const earliest = new Date(now.getTime() + (input.withinHours || 0) * 60 * 60 * 1000)

  const slots: ComputedSlot[] = []
  const cursor = new Date(pick)
  cursor.setHours(openAt.hours, openAt.minutes, 0, 0)

  const lastStart = new Date(pick)
  lastStart.setHours(closeAt.hours, closeAt.minutes, 0, 0)
  lastStart.setMinutes(lastStart.getMinutes() - duration)

  while (cursor.getTime() <= lastStart.getTime()) {
    const hour = cursor.getHours()
    const minute = cursor.getMinutes()
    const extend = (duration + minute) / 60
    let blocked = false

    if (input.disable15 && minute === 15) blocked = true
    if (input.disable30 && minute === 30) blocked = true
    if (input.disable45 && minute === 45) blocked = true
    if (cursor.getTime() < earliest.getTime()) blocked = true

    if (!blocked) {
      for (let i = 0; i < extend && hour + i < 24; i += 1) {
        if (occupancy[hour + i] + extraGuests >= maxApp) {
          blocked = true
          break
        }
      }
    }

    if (!blocked) {
      slots.push({
        time: formatTimeLabel(hour, minute),
        hour,
        minute,
        band: bandForHour(hour),
      })
    }

    cursor.setMinutes(cursor.getMinutes() + 15)
  }

  return {
    open: true,
    hours: { from: dayHours.from, to: dayHours.to },
    slots,
  }
}
