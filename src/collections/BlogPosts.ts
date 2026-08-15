import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { authenticated } from '@/payload/access'
import { friendlyList, photoCell, slugify } from '@/payload/adminFields'
import { revalidateOnChange } from '@/payload/hooks/revalidateOnChange'

const ensurePublishedAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const next = { ...data }
  const status = next.status ?? originalDoc?.status
  if (status === 'published' && !next.publishedAt && !originalDoc?.publishedAt) {
    next.publishedAt = new Date().toISOString()
  }
  return next
}

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },
  defaultSort: '-updatedAt',
  admin: {
    ...friendlyList,
    useAsTitle: 'title',
    defaultColumns: ['title', 'featuredImage', 'status', 'publishedAt'],
    listSearchableFields: ['title', 'excerpt'],
    group: 'Marketing',
    description:
      'Articles on the Blog page. Posts stay hidden while Status is “Draft”.',
    preview: (doc) => {
      const slug = typeof doc?.slug === 'string' ? doc.slug : ''
      if (!slug) return null
      const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
      return `${base}/blog/${slug}`
    },
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        status: {
          equals: 'published',
        },
      }
    },
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
      name: 'slug',
      label: 'Web address name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Filled in from the title. You can leave this alone.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(String(value))
            if (data?.title) return slugify(String(data.title))
            return value
          },
        ],
      },
    },
    {
      name: 'excerpt',
      label: 'Short summary',
      type: 'textarea',
      admin: {
        description: 'Shown on the blog listing cards.',
      },
    },
    {
      name: 'featuredImage',
      label: 'Cover photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        components: photoCell,
      },
    },
    {
      name: 'content',
      label: 'Article',
      type: 'richText',
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft — not on website yet', value: 'draft' },
        { label: 'Published — live on website', value: 'published' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      label: 'Publish date',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Set automatically the first time you publish, if left empty.',
      },
    },
  ],
  hooks: {
    beforeChange: [ensurePublishedAt],
    afterChange: [revalidateOnChange],
  },
}
