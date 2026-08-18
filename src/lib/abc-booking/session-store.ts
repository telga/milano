import { randomUUID } from 'crypto'

import type { AbcSessionData } from '@/lib/abc-booking/types'

const SESSION_TTL_MS = 30 * 60 * 1000
const sessions = new Map<string, AbcSessionData>()

export function createSession(employeesCrypt: string): AbcSessionData {
  pruneExpired()
  const session: AbcSessionData = {
    id: randomUUID(),
    employeesCrypt,
    createdAt: Date.now(),
  }
  sessions.set(session.id, session)
  return session
}

export function getSession(id: string): AbcSessionData | null {
  pruneExpired()
  const session = sessions.get(id)
  if (!session) return null
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(id)
    return null
  }
  return session
}

function pruneExpired() {
  const now = Date.now()
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL_MS) sessions.delete(id)
  }
}
