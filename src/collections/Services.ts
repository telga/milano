import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import {
  displayOrderField,
  friendlyList,
  minutesCell,
  priceCell,
  publishedCheckbox,
  yesNoCell,
} from '@/payload/adminFields'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Service',
    plural: 'Services',
  },
  defaultSort: ['category', 'name'],
  admin: {
    ...friendlyList,
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'durationMinutes', 'published'],
    listSearchableFields: ['name', 'description'],
    group: 'Services',
    description: 'Individual treatments, grouped by the category they appear under.',
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
      label: 'Service name',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'relationship',
      relationTo: 'service-categories',
      required: true,
      admin: {
        description: 'Which group this service belongs to on the Services page.',
        components: {
          Cell: '/components/admin/cells/CategoryCell',
        },
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'durationMinutes',
          label: 'Time needed (minutes)',
          type: 'number',
          admin: {
            width: '50%',
            description: 'Optional. Example: 45',
            components: minutesCell,
          },
        },
        {
          name: 'price',
          label: 'Price',
          type: 'number',
          admin: {
            width: '50%',
            description: 'Dollars only, no “$”. Customers see it only if “Show price” is on.',
            components: priceCell,
          },
        },
      ],
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      admin: {
        description: 'Short paragraph customers see for this service.',
      },
    },
    {
      name: 'bullets',
      label: 'What’s included',
      type: 'array',
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      admin: {
        description: 'Checklist items under the service (soak, cuticle care, polish, etc.).',
        components: {
          RowLabel: '/components/admin/cells/RowLabels#BulletRowLabel',
        },
      },
      fields: [
        {
          name: 'text',
          label: 'Item',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'showPrice',
      label: 'Show price to customers',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Leave off to keep the price private.',
        components: yesNoCell,
      },
    },
    {
      name: 'abcServiceId',
      label: 'ABC service ID',
      type: 'text',
      admin: {
        position: 'sidebar',
        description:
          'Optional. Maps this service to ABC Salon booking (format: category::name::index). Leave blank for auto-match by name.',
      },
    },
    displayOrderField,
    publishedCheckbox,
  ],
}
