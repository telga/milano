import { abcPost } from '@/lib/abc-booking/client'
import { decodeAbcPayload } from '@/lib/abc-booking/decode'
import type { AbcShopHours, AbcShopInfo } from '@/lib/abc-booking/types'

type ShopResponse = {
  shopinfo?: string
}

type RawDayHours = { from?: string; to?: string }

type RawShop = {
  name?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  within?: string
  max_app_hour?: string
  disable_15_min?: boolean
  disable_30_min?: boolean
  disable_45_min?: boolean
  weekly_max_app?: Record<string, string>
  option?: Record<string, RawDayHours | string | Record<string, unknown>>
}

export async function fetchAbcShopInfo(): Promise<AbcShopInfo> {
  const data = await abcPost<ShopResponse>({ shop_crypt: '' })
  if (!data.shopinfo) {
    throw new Error('ABC shop info unavailable')
  }

  const raw = decodeAbcPayload<RawShop>(data.shopinfo)
  const hours: AbcShopHours[] = []
  const hoursByDay: AbcShopInfo['hoursByDay'] = {}
  const holidays: AbcShopInfo['holidays'] = {}
  const weeklyMaxApp: Record<number, number> = {}

  if (raw.option) {
    for (const [dayKey, value] of Object.entries(raw.option)) {
      if (dayKey === 'holiday') {
        if (value && typeof value === 'object') {
          for (const [key, holiday] of Object.entries(value)) {
            if (holiday === 'closed') holidays[key] = 'closed'
            else if (holiday && typeof holiday === 'object' && 'from' in holiday) {
              holidays[key] = {
                from: String((holiday as RawDayHours).from || ''),
                to: String((holiday as RawDayHours).to || ''),
              }
            }
          }
        }
        continue
      }
      if (typeof value !== 'object' || value === null) continue
      if (!('from' in value) || !('to' in value)) continue
      const day = Number(dayKey)
      if (Number.isNaN(day)) continue
      const from = String(value.from)
      const to = String(value.to)
      hours.push({ day, from, to })
      hoursByDay[day] = { from, to }
    }
  }

  if (raw.weekly_max_app) {
    for (const [day, value] of Object.entries(raw.weekly_max_app)) {
      const n = Number(value)
      if (!Number.isNaN(n)) weeklyMaxApp[Number(day)] = n
    }
  }

  return {
    name: raw.name || 'Milano Nail Spa',
    phone: raw.phone || '',
    address: raw.address || '',
    city: raw.city || '',
    state: raw.state || '',
    zip: raw.zip || '',
    hours,
    hoursByDay,
    holidays,
    withinHours: Number(raw.within) || 0,
    maxAppHour: Number(raw.max_app_hour) || undefined,
    weeklyMaxApp,
    disable15: Boolean(raw.disable_15_min),
    disable30: Boolean(raw.disable_30_min),
    disable45: Boolean(raw.disable_45_min),
  }
}
