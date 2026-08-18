import { abcPostRaw } from '@/lib/abc-booking/client'
import { fetchAbcCatalog } from '@/lib/abc-booking/catalog'
import { encodeAbcPayload } from '@/lib/abc-booking/decode'
import { fetchAbcShopInfo } from '@/lib/abc-booking/shop'
import { toAbcDate } from '@/lib/abc-booking/slots'
import type { AbcService } from '@/lib/abc-booking/types'

export type NativeSubmitInput = {
  serviceIds: string[]
  dateIso: string
  time: string
  name: string
  phone: string
  note?: string
  staffName?: string | null
  guestCount?: number
}

export type AbcAppointmentService = {
  name: string
  children: string
  price: number | null
  duration: number
  init?: string
  no_everyone: boolean
}

export type AbcAppointmentPayload = {
  services: AbcAppointmentService[]
  duration: number
  date: string
  hour: string
  name: string
  phone: string
  note: string
  request: string
  option: {
    shop_name: string
    shop_phone: string
    shop_address: string
    shop_city: string
    shop_state: string
    shop_zip: string
    num_cust: string
  }
}

export function toMilitaryHour(label: string): string | null {
  const parts = label.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!parts) return null
  let hours = Number(parts[1])
  const minutes = Number(parts[2])
  const ampm = parts[3].toUpperCase()
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export function toRegularHour(military: string): string | null {
  const [h, m] = military.split(':').map(Number)
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`
}

export function formatShopPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (!match) return phone
  return `(${match[1]}) ${match[2]}-${match[3]}`
}

export function digitsPhone(phone: string): string {
  return phone.replace(/\D/g, '').slice(0, 10)
}

export function buildAbcAppointment(
  input: NativeSubmitInput,
  catalog: AbcService[],
  shop: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
  },
): AbcAppointmentPayload {
  const byId = new Map(catalog.map((service) => [service.id, service]))
  const services: AbcAppointmentService[] = input.serviceIds.map((id) => {
    const service = byId.get(id)
    if (!service) throw new Error(`Unknown service ${id}`)
    return {
      name: service.category,
      children: service.originalName,
      price: service.price,
      duration: service.durationMinutes || 15,
      init: service.init,
      no_everyone: service.noEveryone,
    }
  })

  const military = toMilitaryHour(input.time)
  if (!military) throw new Error('Invalid appointment time')
  const hour = toRegularHour(military)
  if (!hour) throw new Error('Invalid appointment time')

  const phone = digitsPhone(input.phone)
  if (phone.length !== 10) throw new Error('Phone must be 10 digits')

  return {
    services,
    duration: services.reduce((sum, service) => sum + service.duration, 0),
    date: toAbcDate(input.dateIso),
    hour,
    name: input.name.trim(),
    phone,
    note: input.note?.trim() || '',
    request: input.staffName?.trim() || '',
    option: {
      shop_name: shop.name,
      shop_phone: formatShopPhone(shop.phone),
      shop_address: shop.address,
      shop_city: shop.city,
      shop_state: shop.state,
      shop_zip: shop.zip,
      num_cust: String(Math.min(20, Math.max(1, Math.round(Number(input.guestCount) || 1)))),
    },
  }
}

export async function submitAbcAppointment(input: NativeSubmitInput): Promise<void> {
  const [catalog, shop] = await Promise.all([fetchAbcCatalog(), fetchAbcShopInfo()])
  const appointment = buildAbcAppointment(input, catalog, shop)
  const { status, text } = await abcPostRaw({
    command: 'newappointment',
    appid: 'demo',
    appointment: encodeAbcPayload(appointment),
  })

  if (status < 200 || status >= 300) {
    throw new Error(`ABC submit failed (${status})${text ? `: ${text.slice(0, 200)}` : ''}`)
  }
}
