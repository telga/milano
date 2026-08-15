import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { displayOrderField, friendlyList, publishedCheckbox, slugify } from '@/payload/adminFields'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  labels: {
    singular: 'Service Category',
    plural: 'Service Categories',
  },
  defaultSort: 'sortOrder',
  admin: {
    ...friendlyList,
    useAsTitle: 'name',
    defaultColumns: ['name', 'sortOrder', 'published'],
    listSearchableFields: ['name'],
    group: 'Services',
    description: 'The groups treatments are listed under (Manicure, Pedicure, Lashes…).',
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
      label: 'Category name',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: “Manicure Services”.',
      },
    },
    {
      name: 'slug',
      label: 'Web address name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Filled in automatically from the name. You can leave this alone.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, operation }) => {
            if (value) return slugify(String(value))
            if (data?.name) return slugify(String(data.name))
            if (operation === 'create') return value
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      label: 'Short description (optional)',
      type: 'textarea',
      admin: {
        description: 'Optional blurb under the category on the site.',
      },
    },
    displayOrderField,
    publishedCheckbox,
  ],
}
