import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { displayOrderField, friendlyList, photoCell, publishedCheckbox } from '@/payload/adminFields'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
  labels: {
    singular: 'Specialty Design',
    plural: 'Specialty Designs',
  },
  defaultSort: 'sortOrder',
  admin: {
    ...friendlyList,
    useAsTitle: 'title',
    defaultColumns: ['title', 'image', 'published'],
    listSearchableFields: ['title', 'subtitle'],
    group: 'Marketing',
    description: 'Nail design showcase cards on the Specialties page.',
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
      label: 'Design name',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      defaultValue: 'Best Nail Design For You',
    },
    {
      name: 'body',
      label: 'Details (optional)',
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
