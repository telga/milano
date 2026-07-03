import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'durationMinutes', 'showPrice', 'published'],
    group: 'Services Menu',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
    },
    {
      name: 'durationMinutes',
      type: 'number',
      admin: {
        description: 'Treatment duration in minutes (optional)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'bullets',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      admin: {
        description: 'Stored for admin use — hidden on public site until Show Price is enabled.',
      },
    },
    {
      name: 'showPrice',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, price appears on the public services page.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
