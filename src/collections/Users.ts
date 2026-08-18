import type { CollectionConfig } from 'payload'

import { adminField, adminOnly, adminOrSelf, hideFromEditors, isAdmin } from '@/payload/access'
import { friendlyList } from '@/payload/adminFields'
import { trackEvent } from '@/lib/metrics/track'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Staff Login',
    plural: 'Staff Logins',
  },
  admin: {
    ...friendlyList,
    useAsTitle: 'username',
    defaultColumns: ['username', 'role', 'updatedAt'],
    group: 'Administration',
    description:
      'People who can sign in to manage the website. Staff only need a username and password — email is optional. Only admins should change this.',
    hidden: hideFromEditors,
  },
  auth: {
    // Username is the login ID. Email is optional when creating staff.
    loginWithUsername: {
      allowEmailLogin: true,
      requireEmail: false,
    },
  },
  access: {
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
    admin: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterLogin: [
      async ({ user }) => {
        const role = typeof user === 'object' && user && 'role' in user ? String(user.role || 'staff') : 'staff'
        void trackEvent({ type: 'admin_login', status: role })
        return user
      },
    ],
  },
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'What they type to sign in. Required.',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      admin: {
        description: 'Optional. Not needed to sign in.',
      },
    },
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin — full access', value: 'admin' },
        { label: 'Editor — content only', value: 'editor' },
      ],
      required: true,
      access: {
        create: adminField,
        update: adminField,
      },
      admin: {
        description: 'Editors can update website content. Admins can also manage logins and technical settings.',
        condition: (_data, _sibling, { user }) => isAdmin(user),
      },
    },
  ],
}
