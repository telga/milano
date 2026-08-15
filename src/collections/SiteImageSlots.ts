import type { CollectionConfig } from 'payload'

import { anyone, authenticated, adminOnly, hideFromEditors } from '@/payload/access'
import { friendlyList, photoCell, yesNoCell } from '@/payload/adminFields'
import { revalidateOnChange } from '@/payload/hooks/revalidateOnChange'

/** Ordered slot IDs for sequential unique image assignment during scrape/seed */
export const SLOT_ASSIGNMENT_ORDER = [
  'home-hero',
  'home-tile-promotions',
  'home-tile-specialties',
  'home-tile-services',
  'home-tile-gallery',
  'about-grid-1',
  'about-grid-2',
  'about-grid-3',
  'about-grid-4',
  'visit-us-hero',
  'promotions-hero',
  'specialties-hero',
  'services-hero',
  'gallery-hero',
  'blog-hero',
  'contact-hero',
  'logo',
] as const

export const SITE_IMAGE_SLOTS = [
  { slotId: 'home-hero', label: 'Home — Hero', page: 'Home', sortOrder: 1 },
  { slotId: 'home-tile-promotions', label: 'Home — Promotions Tile', page: 'Home', sortOrder: 2 },
  { slotId: 'home-tile-specialties', label: 'Home — Specialties Tile', page: 'Home', sortOrder: 3 },
  { slotId: 'home-tile-services', label: 'Home — Services Tile', page: 'Home', sortOrder: 4 },
  { slotId: 'home-tile-gallery', label: 'Home — Gallery Tile', page: 'Home', sortOrder: 5 },
  { slotId: 'about-grid-1', label: 'About — Grid Photo 1', page: 'About', sortOrder: 6 },
  { slotId: 'about-grid-2', label: 'About — Grid Photo 2', page: 'About', sortOrder: 7 },
  { slotId: 'about-grid-3', label: 'About — Grid Photo 3', page: 'About', sortOrder: 8 },
  { slotId: 'about-grid-4', label: 'About — Grid Photo 4', page: 'About', sortOrder: 9 },
  { slotId: 'visit-us-hero', label: 'About — Salon Experience', page: 'About', sortOrder: 10 },
  { slotId: 'promotions-hero', label: 'Promotions — Hero', page: 'Promotions', sortOrder: 11 },
  { slotId: 'specialties-hero', label: 'Specialties — Hero', page: 'Specialties', sortOrder: 12 },
  { slotId: 'services-hero', label: 'Services — Hero', page: 'Services', sortOrder: 13 },
  { slotId: 'gallery-hero', label: 'Gallery — Hero', page: 'Gallery', sortOrder: 14 },
  { slotId: 'blog-hero', label: 'Blog — Hero', page: 'Blog', sortOrder: 15 },
  { slotId: 'contact-hero', label: 'Contact — Hero', page: 'Contact', sortOrder: 16 },
  { slotId: 'logo', label: 'Site Logo', page: 'Global', sortOrder: 0 },
] as const

export type SiteImageSlotId = (typeof SITE_IMAGE_SLOTS)[number]['slotId']

export const SiteImageSlots: CollectionConfig = {
  slug: 'site-image-slots',
  labels: {
    singular: 'Website Photo Spot',
    plural: 'Website Photo Spots',
  },
  defaultSort: 'sortOrder',
  admin: {
    ...friendlyList,
    useAsTitle: 'label',
    defaultColumns: ['label', 'usePlaceholder', 'image', 'page'],
    listSearchableFields: ['label', 'page'],
    description:
      'Choose a photo, or turn on the standard grey crosshatch placeholder, then save.',
    group: 'Photos',
  },
  access: {
    read: anyone,
    create: adminOnly,
    update: authenticated,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'slotId',
      type: 'select',
      required: true,
      unique: true,
      options: SITE_IMAGE_SLOTS.map((s) => ({
        label: s.label,
        value: s.slotId,
      })),
      admin: {
        readOnly: true,
        description: 'System ID — do not change. Pick a different row instead.',
        condition: (_data, _sibling, { user }) => !hideFromEditors({ user }),
      },
    },
    {
      name: 'label',
      label: 'Photo spot',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        description: 'Friendly name of this photo spot on the live site.',
      },
    },
    {
      name: 'page',
      label: 'Page',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'usePlaceholder',
      label: 'Use grey crosshatch placeholder',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Turn this on to show the standard dark grey crosshatch instead of a photo. Your selected photo stays saved for when you turn this off.',
        components: yesNoCell,
      },
    },
    {
      name: 'image',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description:
          'Choose an existing photo or upload a new one. Hero photos can be changed here too.',
        condition: (_data, siblingData) => !siblingData?.usePlaceholder,
        components: photoCell,
      },
    },
    {
      name: 'sortOrder',
      label: 'Order in this list',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        condition: (_data, _sibling, { user }) => !hideFromEditors({ user }),
      },
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange],
  },
}
