import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { displayOrderField, friendlyList, photoCell, publishedCheckbox } from '@/payload/adminFields'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery-items',
  labels: {
    singular: 'Gallery Photo',
    plural: 'Gallery Photos',
  },
  defaultSort: 'sortOrder',
  admin: {
    ...friendlyList,
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'image', 'category', 'published'],
    listSearchableFields: ['caption'],
    group: 'Photos',
    description: 'Photos on the Gallery page. Each one needs a photo and a gallery filter.',
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
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        components: photoCell,
      },
    },
    {
      name: 'caption',
      label: 'Caption (optional)',
      type: 'text',
      admin: {
        description: 'Short label under or with the photo.',
      },
    },
    {
      name: 'category',
      label: 'Gallery filter',
      type: 'select',
      options: [
        { label: 'Nail Art', value: 'nail-art' },
        { label: 'Salon Interior', value: 'interior' },
        { label: 'Legacy Import', value: 'legacy-import' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'nail-art',
      admin: {
        description: 'Used for gallery filters on the website.',
      },
    },
    displayOrderField,
    publishedCheckbox,
  ],
}
