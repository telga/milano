import { existsSync, mkdirSync, readFileSync } from 'fs'
import { join } from 'path'
import type { Payload } from 'payload'

import { SITE_IMAGE_SLOTS } from '@/collections/SiteImageSlots'
import { isCloudinaryConfigured } from '@/lib/cloudinary/config'
import { SERVICE_CATEGORIES } from '@/lib/data/services'
import { runFixImageSlots } from '@/lib/fix-image-slots'

type ManifestEntry = {
  slot?: string
  collection?: string
  sourceUrl: string
  localPath: string
  publicPath: string
  alt: string
  sortOrder?: number
  title?: string
  cloudinaryPublicId?: string
  cloudinaryUrl?: string
}

const BLOG_SLUG = 'distinctive-features-of-milano-nail-spa-in-flower-mound'

const BLOG_BODY = `Milano Nail Spa in Flower Mound sets itself apart through several distinctive attributes:

1. Expansive Space: Our establishment boasts a generous floor area spanning over 5,000 square feet, ensuring a spacious and comfortable environment.

2. Pedicure Excellence: We offer 40 cutting-edge, high-end pedicure chairs distributed across four mid-sized rooms designed for tranquility and privacy.

3. Artistry in Manicures: Our salon features 26 manicure stations, each adorned with an array of artistic designs, including seasonal collections.

4. Elegant Setting: Characterized by lofty ceilings and opulent European-inspired décor, our salon radiates sophistication.

5. Skillful Technicians: Our highly trained technicians specialize in delivering top-tier foot massages and nail services.

6. Client-Centric Philosophy: We prioritize your experience from the moment you step inside until your departure.

7. Extensive Nail Palette: Choose from over 2,000 polish and powder colors, featuring OPI and iGel.

8. Regular Promotions: Monthly promotions and weekly discounts for medical professionals, students, educators, military personnel, seniors, and birthday celebrations.

9. Comprehensive Services: Beyond nail care, our services encompass eyelash enhancements and waxing.

10. Accessible Luxury: Unparalleled quality at reasonable rates — while supporting charitable causes through Smile of Compassion Projects.`

function textToLexical(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: text.split('\n\n').map((paragraph) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          {
            type: 'text',
            text: paragraph,
            format: 0,
            version: 1,
            detail: 0,
            mode: 'normal' as const,
            style: '',
          },
        ],
      })),
    },
  }
}

/** Vercel's filesystem is read-only — Payload cannot mkdir `media/` there. */
function canSeedMediaFiles(): boolean {
  if (process.env.VERCEL) return false
  try {
    mkdirSync(join(process.cwd(), 'media'), { recursive: true })
    return true
  } catch {
    return false
  }
}

async function uploadMediaFromFile(
  payload: Payload,
  filePath: string,
  alt: string,
  sourceUrl: string,
) {
  try {
    const absolute = join(process.cwd(), 'scripts', 'assets', filePath)
    if (!existsSync(absolute)) return null

    const existing = await payload.find({
      collection: 'media',
      where: { sourceUrl: { equals: sourceUrl } },
      limit: 1,
    })
    if (existing.docs[0]) return existing.docs[0]

    return await payload.create({
      collection: 'media',
      data: { alt, sourceUrl },
      filePath: absolute,
    })
  } catch {
    return null
  }
}

function buildCloudinaryUrl(entry: ManifestEntry): string | null {
  if (entry.cloudinaryUrl) return entry.cloudinaryUrl
  if (!entry.cloudinaryPublicId) return null
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) return null
  return `https://res.cloudinary.com/${cloudName}/image/upload/${entry.cloudinaryPublicId}`
}

const TINY_JPEG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

async function ensureCloudinaryMedia(
  payload: Payload,
  entry: ManifestEntry,
): Promise<{ id: number | string } | null> {
  const cloudinaryUrl = buildCloudinaryUrl(entry)
  if (!entry.cloudinaryPublicId || !cloudinaryUrl) return null

  const filename = `${entry.cloudinaryPublicId.replace(/[^\w.-]+/g, '-')}.jpg`
  const mediaData = {
    alt: entry.alt,
    sourceUrl: entry.sourceUrl,
    cloudinaryPublicId: entry.cloudinaryPublicId,
    url: cloudinaryUrl,
    filename,
    mimeType: 'image/jpeg',
    filesize: 1,
  }

  const existing = await payload.find({
    collection: 'media',
    where: { sourceUrl: { equals: entry.sourceUrl } },
    limit: 1,
  })

  if (existing.docs[0]) {
    const current = existing.docs[0]
    await payload.update({
      collection: 'media',
      id: current.id,
      data: mediaData,
    })
    return current as { id: number | string }
  }

  try {
    const created = await payload.create({
      collection: 'media',
      data: mediaData,
    })
    return created as { id: number | string }
  } catch {
    try {
      const created = await payload.create({
        collection: 'media',
        data: mediaData,
        file: {
          data: TINY_JPEG,
          mimetype: 'image/png',
          name: filename.replace(/\.jpg$/, '.png'),
          size: TINY_JPEG.length,
        },
      })
      return created as { id: number | string }
    } catch (error) {
      console.error('[seed] Cloudinary media create failed', entry.sourceUrl, error)
      return null
    }
  }
}

async function seedServiceCatalog(payload: Payload) {
  for (const category of SERVICE_CATEGORIES) {
    const catDoc = await payload.find({
      collection: 'service-categories',
      where: { slug: { equals: category.slug } },
      limit: 1,
    })

    let categoryId: number
    if (catDoc.docs[0]) {
      categoryId = Number(catDoc.docs[0].id)
      await payload.update({
        collection: 'service-categories',
        id: categoryId,
        data: { name: category.name, sortOrder: category.sortOrder, published: true },
      })
    } else {
      const created = await payload.create({
        collection: 'service-categories',
        data: {
          name: category.name,
          slug: category.slug,
          sortOrder: category.sortOrder,
          published: true,
        },
      })
      categoryId = Number(created.id)
    }

    for (const [i, service] of category.services.entries()) {
      const existing = await payload.find({
        collection: 'services',
        where: {
          and: [{ name: { equals: service.name } }, { category: { equals: categoryId } }],
        },
        limit: 1,
      })

      const data = {
        name: service.name,
        category: categoryId,
        durationMinutes: service.durationMinutes,
        description: service.description,
        bullets: service.bullets?.map((text) => ({ text })),
        showPrice: false,
        sortOrder: i,
        published: true,
      }

      if (existing.docs[0]) {
        await payload.update({ collection: 'services', id: existing.docs[0].id, data })
      } else {
        await payload.create({ collection: 'services', data })
      }
    }
  }
}

export async function backfillStaffUsernames(payload: Payload) {
  const users = await payload.find({ collection: 'users', limit: 100 })
  const updated: Array<{ id: number | string; username: string }> = []

  for (const user of users.docs) {
    const existing = user as { id: number | string; username?: string | null; email?: string | null }
    if (existing.username) continue

    const fromEmail =
      typeof existing.email === 'string' && existing.email.includes('@')
        ? existing.email.split('@')[0]
        : null
    const username =
      existing.id === users.docs[0]?.id && process.env.ADMIN_USERNAME
        ? process.env.ADMIN_USERNAME
        : fromEmail || `staff${existing.id}`

    await payload.update({
      collection: 'users',
      id: existing.id,
      data: { username },
    })
    updated.push({ id: existing.id, username })
  }

  return { updated, total: users.docs.length }
}

export async function runSeed(payload: Payload) {
  const users = await payload.find({ collection: 'users', limit: 100 })
  if (!users.docs.length) {
    const email = process.env.ADMIN_EMAIL || 'admin@milanonailflowermound.com'
    await payload.create({
      collection: 'users',
      data: {
        username: process.env.ADMIN_USERNAME || 'admin',
        email,
        password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
        role: 'admin',
      },
    })
  } else {
    await backfillStaffUsernames(payload)
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      businessName: 'Milano Nail Spa Flower Mound',
      tagline: 'Where glamour meets exquisite nail care',
      phone: '(214) 513-4800',
      email: 'milanonailflowermound@gmail.com',
      address: '5801 Long Prairie Road, Suite 680, Flower Mound, TX 75028',
      bookingUrl: 'https://abcapp.us/feedback/appointment?appid=tI8PdCO',
    },
  })

  await seedServiceCatalog(payload)

  const manifestPath = join(process.cwd(), 'scripts', 'image-manifest.json')
  let manifest: ManifestEntry[] = []
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))
  }

  const mediaByUrl = new Map<string, number>()
  const importLocalMedia = canSeedMediaFiles()
  const importCloudinaryMedia = isCloudinaryConfigured()

  if (importCloudinaryMedia) {
    for (const entry of manifest) {
      const media = await ensureCloudinaryMedia(payload, entry)
      if (media) mediaByUrl.set(entry.sourceUrl, Number(media.id))
    }
  } else if (importLocalMedia) {
    for (const entry of manifest) {
      const media = await uploadMediaFromFile(payload, entry.localPath, entry.alt, entry.sourceUrl)
      if (media) mediaByUrl.set(entry.sourceUrl, Number(media.id))
    }
  }

  const hasMedia = mediaByUrl.size > 0

  for (const slotDef of SITE_IMAGE_SLOTS) {
    const manifestEntry = manifest.find((m) => m.slot === slotDef.slotId)
    const imageId = manifestEntry ? mediaByUrl.get(manifestEntry.sourceUrl) : undefined

    const existing = await payload.find({
      collection: 'site-image-slots',
      where: { slotId: { equals: slotDef.slotId } },
      limit: 1,
    })

    const data = {
      slotId: slotDef.slotId,
      label: slotDef.label,
      page: slotDef.page,
      sortOrder: slotDef.sortOrder,
      ...(imageId ? { image: imageId } : {}),
    }

    if (existing.docs[0]) {
      await payload.update({ collection: 'site-image-slots', id: existing.docs[0].id, data })
    } else {
      await payload.create({ collection: 'site-image-slots', data })
    }
  }

  if (hasMedia) {
    const logoEntry = manifest.find((m) => m.slot === 'logo')
    if (logoEntry) {
      const logoId = mediaByUrl.get(logoEntry.sourceUrl)
      if (logoId) {
        await payload.updateGlobal({ slug: 'site-settings', data: { logo: logoId } })
      }
    }

    for (const entry of manifest.filter((m) => m.collection === 'gallery-items')) {
      const imageId = mediaByUrl.get(entry.sourceUrl)
      if (!imageId) continue
      const dup = await payload.find({
        collection: 'gallery-items',
        where: { image: { equals: imageId } },
        limit: 1,
      })
      if (dup.docs[0]) continue
      await payload.create({
        collection: 'gallery-items',
        data: {
          image: imageId,
          caption: entry.alt,
          category: 'legacy-import',
          sortOrder: entry.sortOrder ?? 0,
          published: true,
        },
      })
    }

    for (const entry of manifest.filter((m) => m.collection === 'promotions')) {
      const imageId = mediaByUrl.get(entry.sourceUrl)
      if (!imageId) continue
      await payload.create({
        collection: 'promotions',
        data: {
          title: entry.title || 'Promotion',
          image: imageId,
          sortOrder: entry.sortOrder ?? 0,
          published: true,
        },
      })
    }

    for (const entry of manifest.filter((m) => m.collection === 'specialties')) {
      const imageId = mediaByUrl.get(entry.sourceUrl)
      if (!imageId) continue
      await payload.create({
        collection: 'specialties',
        data: {
          title: entry.title || 'Specialty Design',
          subtitle: 'Best Nail Design For You',
          image: imageId,
          sortOrder: entry.sortOrder ?? 0,
          published: true,
        },
      })
    }
  }

  const blogFeatured =
    hasMedia &&
    (manifest.find((m) => m.slot === 'blog-hero') ||
      manifest.find((m) => m.slot === 'home-hero') ||
      manifest[0])
  const featuredId = blogFeatured ? mediaByUrl.get(blogFeatured.sourceUrl) : undefined

  const existingBlog = await payload.find({
    collection: 'blog-posts',
    where: { slug: { equals: BLOG_SLUG } },
    limit: 1,
  })

  const blogData = {
    title: 'Distinctive Features of Milano Nail Spa in Flower Mound',
    slug: BLOG_SLUG,
    excerpt:
      'Milano Nail Spa in Flower Mound sets itself apart through expansive space, expert technicians, and a commitment to charitable giving.',
    content: textToLexical(BLOG_BODY),
    status: 'published' as const,
    publishedAt: new Date().toISOString(),
    ...(featuredId ? { featuredImage: featuredId } : {}),
  }

  if (existingBlog.docs[0]) {
    await payload.update({ collection: 'blog-posts', id: existingBlog.docs[0].id, data: blogData })
  } else {
    await payload.create({ collection: 'blog-posts', data: blogData })
  }

  const existingPopup = await payload.find({
    collection: 'popup-announcements',
    where: { title: { equals: 'May 2026 Price Adjustment' } },
    limit: 1,
  })

  const popupData = {
    title: 'May 2026 Price Adjustment',
    headline: 'IMPORTANT ANNOUNCEMENT',
    body: `We will be implementing a modest 3% price increase beginning May 11, 2026.

This adjustment allows us to continue delivering the high standard of service you expect — investing in premium products, maintaining our luxurious environment, and providing ongoing training for our talented team.

We remain deeply committed to offering you a refined, relaxing, and truly luxurious experience every time you visit.`,
    highlightLine: 'Effective May 11, 2026',
    signature: 'Warm regards,\nMilano Nail Spa Flower Mound',
    instagramHandle: '@milanonailspaflowermound',
    showOnHome: true,
    active: true,
    published: true,
    sortOrder: 10,
  }

  if (existingPopup.docs[0]) {
    await payload.update({
      collection: 'popup-announcements',
      id: existingPopup.docs[0].id,
      data: popupData,
    })
  } else {
    await payload.create({ collection: 'popup-announcements', data: popupData })
  }

  const fixResult = hasMedia ? await runFixImageSlots(payload) : { skipped: true }

  return {
    success: true,
    mediaSkipped: !hasMedia,
    imagesImported: mediaByUrl.size,
    categories: SERVICE_CATEGORIES.length,
    imageSlots: fixResult,
  }
}
