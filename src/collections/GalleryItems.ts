import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'category', 'sortOrder', 'published'],
    group: 'Site Photos',
    description: 'Gallery photos — drag sortOrder to reorder on the Gallery page.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Nail Art', value: 'nail-art' },
        { label: 'Salon Interior', value: 'interior' },
        { label: 'Legacy Import', value: 'legacy-import' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'nail-art',
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
