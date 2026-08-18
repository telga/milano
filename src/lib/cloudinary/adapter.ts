import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

import { cloudinaryDeliveryUrl, getCloudinaryCredentials } from '@/lib/cloudinary/config'

const FOLDER = 'milano'

function configureCloudinary() {
  const creds = getCloudinaryCredentials()
  if (!creds) return null
  cloudinary.config({
    cloud_name: creds.cloudName,
    api_key: creds.apiKey,
    api_secret: creds.apiSecret,
    secure: true,
  })
  return creds
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

async function uploadBuffer(file: { buffer: Buffer; filename: string; mimeType: string }) {
  configureCloudinary()
  const publicId = `${FOLDER}/${sanitizeFilename(file.filename) || `upload-${Date.now()}`}`

  return await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          public_id: publicId,
          overwrite: true,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload returned no result'))
            return
          }
          resolve(result)
        },
      )
      .end(file.buffer)
  })
}

export const cloudinaryAdapter: Adapter = () => {
  const adapter: GeneratedAdapter = {
    name: 'cloudinary',
    fields: [
      {
        name: 'cloudinaryPublicId',
        type: 'text',
        admin: {
          hidden: true,
          readOnly: true,
        },
      },
    ],
    generateURL: ({ data }) => {
      const publicId =
        typeof data?.cloudinaryPublicId === 'string' ? data.cloudinaryPublicId : undefined
      if (publicId) return cloudinaryDeliveryUrl(publicId) || ''
      if (typeof data?.url === 'string' && data.url.startsWith('http')) return data.url
      return ''
    },
    handleUpload: async ({ data, file }) => {
      if (typeof data.cloudinaryPublicId === 'string' && data.cloudinaryPublicId) {
        return {
          cloudinaryPublicId: data.cloudinaryPublicId,
          url: data.url || cloudinaryDeliveryUrl(data.cloudinaryPublicId),
        }
      }

      const result = await uploadBuffer(file)
      return {
        cloudinaryPublicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
      }
    },
    handleDelete: async ({ doc }) => {
      const publicId =
        'cloudinaryPublicId' in doc && typeof doc.cloudinaryPublicId === 'string'
          ? doc.cloudinaryPublicId
          : undefined
      if (!publicId) return
      configureCloudinary()
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
      } catch {
        // Missing Cloudinary files should not block deleting the CMS record.
      }
    },
    staticHandler: async (_req, { doc }) => {
      const publicId =
        doc && 'cloudinaryPublicId' in doc && typeof doc.cloudinaryPublicId === 'string'
          ? doc.cloudinaryPublicId
          : undefined
      const url =
        (publicId && cloudinaryDeliveryUrl(publicId)) ||
        (doc && 'url' in doc && typeof doc.url === 'string' ? doc.url : null)
      if (!url) return new Response(null, { status: 404 })
      return Response.redirect(url, 302)
    },
  }

  return adapter
}
