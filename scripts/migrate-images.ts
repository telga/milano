import { loadEnvConfig } from '@next/env'
import { v2 as cloudinary } from 'cloudinary'
import { createHash } from 'crypto'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

/**
 * Optional: upload scraped assets to Cloudinary when credentials are configured.
 * Updates image-manifest.json with cloudinaryPublicId fields.
 */
async function main() {
  loadEnvConfig(process.cwd(), false)
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.log('Cloudinary credentials not set — skipping upload. Using local/Payload media.')
    return
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  })

  const manifestPath = join(process.cwd(), 'scripts', 'image-manifest.json')
  if (!existsSync(manifestPath)) {
    console.log('No manifest found. Run scrape first.')
    return
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as Array<{
    sourceUrl: string
    localPath: string
    cloudinaryPublicId?: string
    cloudinaryUrl?: string
  }>

  for (const entry of manifest) {
    const filePath = join(process.cwd(), 'scripts', 'assets', entry.localPath)
    if (!existsSync(filePath)) continue

    const desiredPublicId = `milano-nail-spa/legacy-${createHash('sha256')
      .update(entry.sourceUrl)
      .digest('hex')
      .slice(0, 24)}`

    if (entry.cloudinaryPublicId === desiredPublicId && entry.cloudinaryUrl) continue

    const result = await cloudinary.uploader.upload(filePath, {
      public_id: desiredPublicId,
      overwrite: true,
      resource_type: 'image',
    })

    entry.cloudinaryPublicId = result.public_id
    entry.cloudinaryUrl = result.secure_url
    console.log(`Uploaded ${entry.localPath} → ${result.secure_url}`)
  }

  const { writeFileSync } = await import('fs')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  console.log('Cloudinary migration complete.')
}

main().catch(console.error)
