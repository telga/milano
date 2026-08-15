import type { Access, FieldAccess, PayloadRequest } from 'payload'

type UserWithRole = {
  id?: string | number
  role?: 'admin' | 'editor' | null
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    published: {
      equals: true,
    },
  }
}

export function getUserRole(user: PayloadRequest['user'] | UserWithRole | null | undefined) {
  return (user as UserWithRole | null | undefined)?.role ?? null
}

export function isAdmin(user: PayloadRequest['user'] | UserWithRole | null | undefined) {
  return getUserRole(user) === 'admin'
}

export function isEditor(user: PayloadRequest['user'] | UserWithRole | null | undefined) {
  return getUserRole(user) === 'editor'
}

export const adminOnly: Access = ({ req: { user } }) => isAdmin(user)

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdmin(user)) return true
  return {
    id: {
      equals: user.id,
    },
  }
}

/** Editors may update media; only admins manage accounts and technical config. */
export const adminField: FieldAccess = ({ req: { user } }) => isAdmin(user)

export const hideFromEditors = ({ user }: { user?: PayloadRequest['user'] | null }) =>
  !isAdmin(user)
