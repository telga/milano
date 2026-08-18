import { abcPost } from '@/lib/abc-booking/client'
import { decodeAbcPayload } from '@/lib/abc-booking/decode'
import type { AbcStaffMember } from '@/lib/abc-booking/types'

type EmployeesResponse = {
  crypt?: string
  employees?: string
}

export async function fetchAbcEmployees(): Promise<{
  crypt: string
  staff: AbcStaffMember[]
}> {
  const data = await abcPost<EmployeesResponse>({ employees_crypt: '' })
  if (!data.crypt || !data.employees) {
    throw new Error('ABC employees unavailable')
  }

  const raw = decodeAbcPayload<Record<string, unknown>>(data.employees)
  const staff: AbcStaffMember[] = Object.keys(raw)
    .filter((name) => name.length > 0 && name !== 'Any')
    .map((name) => ({ id: name.toLowerCase().replace(/\s+/g, '-'), name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return { crypt: data.crypt, staff }
}
