import 'dotenv/config'
import * as cheerio from 'cheerio'
import { createHash } from 'crypto'
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { extname, join } from 'path'
import { pipeline } from 'stream/promises'

import { SLOT_ASSIGNMENT_ORDER } from '../src/collections/SiteImageSlots'

const LEGACY_BASE = 'https://milanonailspaflowermound.com'
const CRAWL_URLS = [
  '/',
  '/index',
  '/visit-us',
  '/detailed-article?articleId=1',
]

const SCRAPED_DIR = join(process.cwd(), 'scripts', 'assets', 'scraped')
const PUBLIC_SCRAPED = join(process.cwd(), 'public', 'scraped')
const MANIFEST_PATH = join(process.cwd(), 'scripts', 'image-manifest.json')

const SLOT_ORDER = SLOT_ASSIGNMENT_ORDER.filter((id) => id !== 'logo')

type ManifestEntry = {
  slot?: string
  collection?: 'gallery-items' | 'promotions' | 'specialties' | 'blog-posts' | 'media'
  sourceUrl: string
  localPath: string
  publicPath: string
  alt: string
  sortOrder?: number
  title?: string
}

function normalizeUrl(src: string, pageUrl: string): string | null {
  if (!src || src.startsWith('data:')) return null
  try {
    return new URL(src, pageUrl).href
  } catch {
    return null
  }
}

function extractImages(html: string, pageUrl: string): Array<{ url: string; context: string; alt: string }> {
  const $ = cheerio.load(html)
  const found: Array<{ url: string; context: string; alt: string }> = []

  $('img').each((_, el) => {
    const attrs = ['src', 'data-src', 'data-lazy-src', 'data-original']
    for (const attr of attrs) {
      const val = $(el).attr(attr)
      const url = val ? normalizeUrl(val, pageUrl) : null
      if (url) {
        found.push({
          url,
          context: $(el).closest('section, div, header, main, article').attr('class') || 'img',
          alt: $(el).attr('alt') || '',
        })
      }
    }
    const srcset = $(el).attr('srcset')
    if (srcset) {
      const best = srcset
        .split(',')
        .map((s) => s.trim().split(/\s+/)[0])
        .filter(Boolean)
        .pop()
      const url = best ? normalizeUrl(best, pageUrl) : null
      if (url) {
        found.push({ url, context: 'srcset', alt: $(el).attr('alt') || '' })
      }
    }
  })

  $('[style*="background"]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const match = style.match(/url\(['"]?([^'")]+)['"]?\)/)
    if (match?.[1]) {
      const url = normalizeUrl(match[1], pageUrl)
      if (url) {
        found.push({
          url,
          context: $(el).attr('class') || 'bg',
          alt: '',
        })
      }
    }
  })

  return found
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'MilanoMigrationBot/1.0' } })
    if (!res.ok || !res.body) return false
    await pipeline(res.body as unknown as NodeJS.ReadableStream, createWriteStream(destPath))
    return true
  } catch {
    return false
  }
}

function hashUrl(url: string): string {
  return createHash('md5').update(url).digest('hex').slice(0, 12)
}

function isLogo(url: string, alt: string, context: string): boolean {
  const lower = `${url} ${alt} ${context}`.toLowerCase()
  return lower.includes('logo') || lower.includes('favicon')
}

async function main() {
  mkdirSync(SCRAPED_DIR, { recursive: true })
  mkdirSync(PUBLIC_SCRAPED, { recursive: true })

  const seen = new Set<string>()
  const allImages: Array<{ url: string; context: string; alt: string }> = []

  for (const path of CRAWL_URLS) {
    const pageUrl = `${LEGACY_BASE}${path}`
    console.log(`Crawling ${pageUrl}...`)
    try {
      const res = await fetch(pageUrl, { headers: { 'User-Agent': 'MilanoMigrationBot/1.0' } })
      if (!res.ok) {
        console.warn(`  Skipped (${res.status})`)
        continue
      }
      const html = await res.text()
      allImages.push(...extractImages(html, pageUrl))
    } catch (err) {
      console.warn(`  Failed: ${err}`)
    }
  }

  const downloaded: ManifestEntry[] = []

  for (const img of allImages) {
    if (seen.has(img.url)) continue
    seen.add(img.url)

    const ext = extname(new URL(img.url).pathname) || '.jpg'
    const filename = `${hashUrl(img.url)}${ext}`
    const localPath = join(SCRAPED_DIR, filename)
    const publicPath = `/scraped/${filename}`

    if (!existsSync(localPath)) {
      const ok = await downloadImage(img.url, localPath)
      if (!ok) continue
    }

    const publicFile = join(PUBLIC_SCRAPED, filename)
    if (!existsSync(publicFile)) {
      writeFileSync(publicFile, readFileSync(localPath))
    }

    downloaded.push({
      sourceUrl: img.url,
      localPath: `scraped/${filename}`,
      publicPath,
      alt: img.alt || 'Milano Nail Spa Flower Mound',
      sortOrder: downloaded.length,
    })
  }

  const manifest: ManifestEntry[] = []
  let slotIndex = 0
  let logoAssigned = false

  for (const entry of downloaded) {
    const imgMeta = allImages.find((i) => i.url === entry.sourceUrl)
    const alt = imgMeta?.alt || entry.alt
    const context = imgMeta?.context || ''

    if (!logoAssigned && isLogo(entry.sourceUrl, alt, context)) {
      manifest.push({ ...entry, slot: 'logo' })
      logoAssigned = true
      continue
    }

    if (slotIndex < SLOT_ORDER.length) {
      manifest.push({ ...entry, slot: SLOT_ORDER[slotIndex] })
      slotIndex++
    } else {
      manifest.push({ ...entry, collection: 'gallery-items' })
    }
  }

  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  console.log(`\nScraped ${manifest.length} images (${slotIndex} slots assigned) → ${MANIFEST_PATH}`)
}

main().catch(console.error)
