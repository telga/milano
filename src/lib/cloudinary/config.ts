export function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return null
  return { cloudName, apiKey, apiSecret }
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(getCloudinaryCredentials())
}

export function cloudinaryDeliveryUrl(
  publicId: string,
  transform?: string,
): string | null {
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName || !publicId) return null
  const parts = ['https://res.cloudinary.com', cloudName, 'image/upload']
  if (transform) parts.push(transform)
  parts.push(publicId)
  return parts.join('/')
}
