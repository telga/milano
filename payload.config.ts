import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { BlogPosts } from './src/collections/BlogPosts'
import { GalleryItems } from './src/collections/GalleryItems'
import { Media } from './src/collections/Media'
import { MetricsEvents } from './src/collections/MetricsEvents'
import { PopupAnnouncements } from './src/collections/PopupAnnouncements'
import { Promotions } from './src/collections/Promotions'
import { ServiceCategories } from './src/collections/ServiceCategories'
import { Services } from './src/collections/Services'
import { SiteImageSlots } from './src/collections/SiteImageSlots'
import { Specialties } from './src/collections/Specialties'
import { Users } from './src/collections/Users'
import { SiteSettings } from './src/globals/SiteSettings'

function getDatabaseAdapter() {
  if (process.env.DATABASE_URI) {
    return postgresAdapter({
      pool: {
        connectionString: process.env.DATABASE_URI,
      },
    })
  }

  return sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), 'milano.db')}`,
    },
    push: process.env.NODE_ENV !== 'production',
  })
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(process.cwd(), 'src'),
    },
    meta: {
      titleSuffix: '— Milano Admin',
      description: 'Update hours, services, photos, and announcements for Milano Nail Spa.',
    },
    components: {
      graphics: {
        Logo: '/components/admin/AdminBrand#AdminLogo',
        Icon: '/components/admin/AdminBrand#AdminIcon',
      },
      beforeNavLinks: ['/components/admin/AdminQuickLinks'],
      views: {
        dashboard: {
          Component: '/components/admin/AdminDashboard',
        },
      },
    },
  },
  // Order here sets the sidebar order: everyday content first, admin last.
  collections: [
    ServiceCategories,
    Services,
    SiteImageSlots,
    GalleryItems,
    Media,
    PopupAnnouncements,
    Promotions,
    Specialties,
    BlogPosts,
    Users,
    MetricsEvents,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-in-production',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'src/payload-types.ts'),
  },
  db: getDatabaseAdapter(),
  sharp,
})
