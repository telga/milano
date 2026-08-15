import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { displayOrderField, friendlyList, photoCell, publishedCheckbox } from '@/payload/adminFields'

export const Promotions: CollectionConfig = {
  slug: 'promotions',
  labels: {
    singular: 'Promotion',
    plural: 'Promotions',
  },
  defaultSort: 'sortOrder',
  admin: {
    ...friendlyList,
    useAsTitle: 'title',
    defaultColumns: ['title', 'image', 'published'],
    listSearchableFields: ['title', 'subtitle'],
    group: 'Marketing',
    description: 'Special offers shown on the Promotions page.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle (optional)',
      type: 'text',
    },
    {
      name: 'body',
      label: 'Details',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        components: photoCell,
      },
    },
    displayOrderField,
    publishedCheckbox,
  ],
}
