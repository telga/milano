import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Original legacy URL (for idempotent re-imports)',
      },
    },
  ],
}
