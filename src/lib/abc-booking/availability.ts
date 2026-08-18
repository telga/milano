import { abcPost } from '@/lib/abc-booking/client'
import { fetchAbcShopInfo } from '@/lib/abc-booking/shop'
import { computeAvailableSlots, toAbcDate } from '@/lib/abc-booking/slots'
import type { AvailabilitySlot } from '@/lib/abc-booking/types'

type ShopAppointment = {
  hour?: string
  duration?: number | null
  option?: string | null
}

export async function fetchShopAppointments(abcDate: string): Promise<ShopAppointment[]> {
  const data = await abcPost<ShopAppointment[]>({
    command: 'shop_appointment',
    date: abcDate,
  })
  return Array.isArray(data) ? data : []
}

export async function getAvailableTimes(input: {
  dateIso: string
  durationMinutes: number
  guestCount?: number
}): Promise<{
  date: string
  open: boolean
  hours?: { from: string; to: string }
  slots: AvailabilitySlot[]
}> {
  const shop = await fetchAbcShopInfo()
  const booked = await fetchShopAppointments(toAbcDate(input.dateIso))
  const result = computeAvailableSlots({
    dateIso: input.dateIso,
    durationMinutes: input.durationMinutes,
    hoursByDay: shop.hoursByDay,
    holidays: shop.holidays,
    withinHours: shop.withinHours,
    maxAppHour: shop.maxAppHour,
    weeklyMaxApp: shop.weeklyMaxApp,
    disable15: shop.disable15,
    disable30: shop.disable30,
    disable45: shop.disable45,
    shopAppointments: booked,
    guestCount: input.guestCount,
  })

  return {
    date: input.dateIso,
    open: result.open,
    hours: result.hours,
    slots: result.slots,
  }
}
