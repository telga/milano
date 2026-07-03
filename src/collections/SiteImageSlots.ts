import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '@/payload/access'
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
  { slotId: 'visit-us-hero', label: 'Visit Us — Hero', page: 'Visit Us', sortOrder: 10 },
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
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'page', 'slotId', 'updatedAt'],
    description: 'Visual photo slots — each entry maps to a specific place on the website.',
    group: 'Site Photos',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'page',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange],
  },
}
