import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { revalidateOnChange } from '@/payload/hooks/revalidateOnChange'

export const PopupAnnouncements: CollectionConfig = {
  slug: 'popup-announcements',
  labels: {
    singular: 'Popup Announcement',
    plural: 'Popup Announcements',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'headline', 'active', 'published', 'updatedAt'],
    group: 'Content',
    description:
      'Homepage popups shown on first visit. Visitors dismiss by clicking anywhere on the popup or backdrop.',
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
      type: 'text',
      required: true,
      admin: {
        description: 'Internal label (not shown on the popup).',
      },
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      defaultValue: 'IMPORTANT ANNOUNCEMENT',
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Main message. Use blank lines between paragraphs.',
      },
    },
    {
      name: 'highlightLine',
      type: 'text',
      admin: {
        description: 'Optional gold callout line (e.g. date or key figure).',
      },
    },
    {
      name: 'signature',
      type: 'text',
      defaultValue: 'Warm regards,\nMilano Nail Spa Flower Mound',
      admin: {
        description: 'Closing line shown in script-style text.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional logo shown top-right. Falls back to Site Settings logo.',
      },
    },
    {
      name: 'instagramHandle',
      type: 'text',
      admin: {
        placeholder: '@milanonailspaflowermound',
      },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show on homepage',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'When enabled, this popup can appear to visitors (if published).',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Optional — popup hidden before this date.',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        description: 'Optional — popup hidden after this date.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Higher number wins when multiple popups are active.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange],
  },
}
