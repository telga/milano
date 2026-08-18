export type NativeBookingStep = 'service' | 'staff' | 'datetime' | 'details' | 'confirm'

export const NATIVE_BOOKING_STEPS: Array<{ id: NativeBookingStep; label: string; number: string }> =
  [
    { id: 'service', label: 'Service', number: '01' },
    { id: 'staff', label: 'Staff', number: '02' },
    { id: 'datetime', label: 'Date & Time', number: '03' },
    { id: 'details', label: 'Details', number: '04' },
    { id: 'confirm', label: 'Confirm', number: '05' },
  ]

export type CartService = {
  id: string
  name: string
  category: string
  displayCategory?: string
  price: number | null
  durationMinutes: number | null
}

export type NativeBookingState = {
  step: NativeBookingStep
  sessionId: string | null
  serviceIds: string[]
  services: CartService[]
  staffMode: 'choose' | 'any'
  staffId: string | null
  staffName: string | null
  date: string | null
  timeBand: 'morning' | 'afternoon' | 'evening' | null
  time: string | null
  guestCount: number
  name: string
  phone: string
  comment: string
  loading: boolean
  error: string | null
}

export type NativeBookingAction =
  | { type: 'SET_STEP'; step: NativeBookingStep }
  | { type: 'SET_SESSION'; sessionId: string }
  | { type: 'SET_SERVICES'; services: CartService[] }
  | { type: 'TOGGLE_SERVICE'; service: CartService }
  | { type: 'SET_STAFF_MODE'; mode: 'choose' | 'any' }
  | { type: 'SET_STAFF'; staffId: string | null; staffName: string | null }
  | { type: 'SET_DATE'; date: string }
  | { type: 'SET_TIME_BAND'; band: 'morning' | 'afternoon' | 'evening' }
  | { type: 'SET_TIME'; time: string; band: 'morning' | 'afternoon' | 'evening' }
  | { type: 'SET_GUEST_COUNT'; count: number; max?: number }
  | { type: 'CLEAR_TIME' }
  | { type: 'SET_DETAILS'; name: string; phone: string; comment: string }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }

export const initialNativeBookingState: NativeBookingState = {
  step: 'service',
  sessionId: null,
  serviceIds: [],
  services: [],
  staffMode: 'any',
  staffId: null,
  staffName: null,
  date: null,
  timeBand: null,
  time: null,
  guestCount: 1,
  name: '',
  phone: '',
  comment: '',
  loading: false,
  error: null,
}

export function nativeBookingReducer(
  state: NativeBookingState,
  action: NativeBookingAction,
): NativeBookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step, error: null }
    case 'SET_SESSION':
      return { ...state, sessionId: action.sessionId }
    case 'SET_SERVICES':
      return { ...state, services: action.services }
    case 'TOGGLE_SERVICE': {
      const exists = state.serviceIds.includes(action.service.id)
      const serviceIds = exists
        ? state.serviceIds.filter((id) => id !== action.service.id)
        : [...state.serviceIds, action.service.id]
      return { ...state, serviceIds }
    }
    case 'SET_STAFF_MODE':
      return {
        ...state,
        staffMode: action.mode,
        staffId: action.mode === 'any' ? null : state.staffId,
        staffName: action.mode === 'any' ? null : state.staffName,
      }
    case 'SET_STAFF':
      return { ...state, staffId: action.staffId, staffName: action.staffName }
    case 'SET_DATE':
      return { ...state, date: action.date, time: null, timeBand: null }
    case 'SET_TIME_BAND':
      return { ...state, timeBand: action.band }
    case 'SET_TIME':
      return { ...state, time: action.time, timeBand: action.band }
    case 'SET_GUEST_COUNT':
      return { ...state, guestCount: clampGuestCount(action.count, action.max) }
    case 'CLEAR_TIME':
      return { ...state, time: null, timeBand: null }
    case 'SET_DETAILS':
      return { ...state, name: action.name, phone: action.phone, comment: action.comment }
    case 'SET_LOADING':
      return { ...state, loading: action.loading }
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false }
    default:
      return state
  }
}

export function stepIndex(step: NativeBookingStep): number {
  return NATIVE_BOOKING_STEPS.findIndex((s) => s.id === step)
}

export function nextStep(step: NativeBookingStep): NativeBookingStep | null {
  const idx = stepIndex(step)
  return NATIVE_BOOKING_STEPS[idx + 1]?.id ?? null
}

export function prevStep(step: NativeBookingStep): NativeBookingStep | null {
  const idx = stepIndex(step)
  return idx > 0 ? NATIVE_BOOKING_STEPS[idx - 1].id : null
}

export const MIN_GUEST_COUNT = 1
export const DEFAULT_MAX_GUEST_COUNT = 20

export function maxGuestCountForStaff(staffCount: number): number {
  if (staffCount <= 0) return DEFAULT_MAX_GUEST_COUNT
  return Math.min(DEFAULT_MAX_GUEST_COUNT, Math.max(14, staffCount))
}

export function clampGuestCount(count: number, max = DEFAULT_MAX_GUEST_COUNT): number {
  const cap = Math.max(MIN_GUEST_COUNT, Math.round(max) || DEFAULT_MAX_GUEST_COUNT)
  if (!Number.isFinite(count)) return MIN_GUEST_COUNT
  return Math.min(cap, Math.max(MIN_GUEST_COUNT, Math.round(count)))
}

export function estimateTotal(services: CartService[], selectedIds: string[], guestCount = 1): number | null {
  const selected = services.filter((s) => selectedIds.includes(s.id))
  const priced = selected.filter((s) => s.price != null)
  if (!priced.length) return null
  const perGuest = priced.reduce((sum, s) => sum + (s.price ?? 0), 0)
  return perGuest * clampGuestCount(guestCount)
}

export function estimateDuration(services: CartService[], selectedIds: string[]): number | null {
  const selected = services.filter((s) => selectedIds.includes(s.id))
  const timed = selected.filter((s) => s.durationMinutes != null)
  if (!timed.length) return null
  return timed.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0)
}

export type BookingCatalogGroup = {
  category: string
  items: CartService[]
}

export function filterBookingCatalog(
  services: CartService[],
  categories: string[],
  query: string,
): BookingCatalogGroup[] {
  const needle = query.trim().toLowerCase()

  return categories
    .map((category) => {
      const items = services.filter(
        (service) => (service.displayCategory || service.category) === category,
      )
      if (!needle) return { category, items }
      return {
        category,
        items: items.filter((service) => serviceMatchesQuery(service, needle)),
      }
    })
    .filter((group) => group.items.length > 0)
}

function serviceMatchesQuery(service: CartService, needle: string): boolean {
  return [service.name, service.category, service.displayCategory ?? ''].some((text) =>
    text.toLowerCase().includes(needle),
  )
}

export function canContinue(state: NativeBookingState): boolean {
  switch (state.step) {
    case 'service':
      return state.serviceIds.length > 0
    case 'staff':
      return state.staffMode === 'any' || Boolean(state.staffId)
    case 'datetime':
      return Boolean(state.date && state.time)
    case 'details':
      return state.name.trim().length >= 2 && state.phone.replace(/\D/g, '').length >= 10
    case 'confirm':
      return true
    default:
      return false
  }
}
