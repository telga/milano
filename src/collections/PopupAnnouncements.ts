import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
import { friendlyList, yesNoCell } from '@/payload/adminFields'
import { revalidateOnChange } from '@/payload/hooks/revalidateOnChange'

/**
 * The website requires both `active` and `published`. Staff only see one switch,
 * so keep the stored pair in sync instead of asking them to tick two boxes.
 */
const mirrorPublishedToActive: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const active = data?.active ?? originalDoc?.active ?? false
  return { ...data, active, published: active }
}

export const PopupAnnouncements: CollectionConfig = {
  slug: 'popup-announcements',
  labels: {
    singular: 'Homepage Announcement',
    plural: 'Homepage Announcements',
  },
  defaultSort: '-updatedAt',
  admin: {
    ...friendlyList,
    useAsTitle: 'title',
    defaultColumns: ['title', 'headline', 'active', 'updatedAt'],
    listSearchableFields: ['title', 'headline'],
    group: 'Marketing',
    description:
      'A popup shown once to each homepage visitor. Only one announcement should be turned on at a time.',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'What it says',
          fields: [
            {
              name: 'title',
              label: 'Name (staff only)',
              type: 'text',
              required: true,
              admin: {
                description: 'For your reference only — not shown on the popup.',
              },
            },
            {
              name: 'headline',
              label: 'Headline',
              type: 'text',
              required: true,
              defaultValue: 'IMPORTANT ANNOUNCEMENT',
              admin: {
                description: 'The large gold text at the top of the popup.',
              },
            },
            {
              name: 'body',
              label: 'Message',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Main message. Press Enter twice between paragraphs.',
              },
            },
            {
              name: 'highlightLine',
              label: 'Gold callout line (optional)',
              type: 'text',
              admin: {
                description: 'Example: a date or key figure to emphasize.',
              },
            },
            {
              name: 'signature',
              label: 'Closing / signature',
              type: 'text',
              defaultValue: 'Warm regards,\nMilano Nail Spa Flower Mound',
            },
            {
              name: 'logo',
              label: 'Logo on popup (optional)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Falls back to the Site Settings logo if empty.',
              },
            },
            {
              name: 'instagramHandle',
              label: 'Instagram handle (optional)',
              type: 'text',
              admin: {
                placeholder: '@milanonailspaflowermound',
              },
            },
          ],
        },
        {
          label: 'When it shows',
          fields: [
            {
              name: 'active',
              label: 'Showing on website',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description:
                  'This is the only switch you need. Turn it off to hide the popup without deleting it.',
                components: yesNoCell,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  label: 'Start showing on (optional)',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                    description: 'Leave empty to start right away.',
                  },
                },
                {
                  name: 'endDate',
                  label: 'Stop showing after (optional)',
                  type: 'date',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                    description: 'Leave empty to keep showing it.',
                  },
                },
              ],
            },
            {
              name: 'showOnHome',
              label: 'Use on the homepage',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Leave this on. Turn it off only if you never want it on the homepage.',
                components: yesNoCell,
              },
            },
            {
              name: 'published',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                hidden: true,
                description: 'Kept in step with the switch above.',
              },
            },
            {
              name: 'sortOrder',
              label: 'Order if more than one is on',
              type: 'number',
              defaultValue: 0,
              admin: {
                description: 'Higher numbers win. Leave at 0 if only one announcement is on.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [mirrorPublishedToActive],
    afterChange: [revalidateOnChange],
  },
}
