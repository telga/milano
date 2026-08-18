import type { CollectionConfig } from 'payload'

import { anyone, authenticated, hideFromEditors } from '@/payload/access'
import { friendlyList } from '@/payload/adminFields'
import { cloudinaryDeliveryUrl } from '@/lib/cloudinary/config'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo / File',
    plural: 'Photo Library',
  },
  admin: {
    ...friendlyList,
    group: 'Photos',
    useAsTitle: 'alt',
    description:
      'Every photo uploaded to the website. You can also upload while editing a gallery photo, photo spot, or blog post.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    listSearchableFields: ['alt', 'filename', 'sourceUrl'],
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    adminThumbnail: ({ doc }) => {
      const d = doc as { cloudinaryPublicId?: string; url?: string }
      if (d.cloudinaryPublicId) {
        return cloudinaryDeliveryUrl(d.cloudinaryPublicId, 'w_300,h_300,c_fill,f_auto,q_auto')
      }
      return d.url || null
    },
  },
  fields: [
    {
      name: 'alt',
      label: 'What is in the photo',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: “Gold chrome manicure on a soft pink background.”',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'Original legacy URL (for idempotent re-imports). Hidden from everyday editors.',
        condition: (_data, _sibling, { user }) => !hideFromEditors({ user }),
      },
    },
  ],
}
