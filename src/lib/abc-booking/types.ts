export type AbcService = {
  id: string
  category: string
  categoryKey: string
  name: string
  originalName: string
  init?: string
  noEveryone: boolean
  price: number | null
  durationMinutes: number | null
  showPrice: boolean
  index: number
}

export type AbcStaffMember = {
  id: string
  name: string
}

export type AbcShopHours = {
  day: number
  from: string
  to: string
  closed?: boolean
}

export type AbcShopInfo = {
  name: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  hours: AbcShopHours[]
  hoursByDay: Record<number, { from: string; to: string }>
  holidays: Record<string, 'closed' | { from: string; to: string }>
  withinHours: number
  maxAppHour?: number
  weeklyMaxApp: Record<number, number>
  disable15: boolean
  disable30: boolean
  disable45: boolean
}

export type AbcSessionData = {
  id: string
  employeesCrypt: string
  createdAt: number
}

export type MergedBookingService = AbcService & {
  cmsName?: string
  cmsDescription?: string
  displayCategory?: string
  categorySortOrder?: number
  serviceSortOrder?: number
}

export type TimeBand = 'morning' | 'afternoon' | 'evening'

export type AvailabilitySlot = {
  time: string
  hour: number
  minute: number
  band: TimeBand
}
