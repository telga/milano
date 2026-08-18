import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'milanonailspaflowermound.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  serverExternalPackages: [
    'drizzle-kit',
    'esbuild',
    'esbuild-register',
    '@esbuild-kit/esm-loader',
    'cloudinary',
    '@payloadcms/plugin-cloud-storage',
  ],
  outputFileTracingIncludes: {
    '/api/migrate': [
      './node_modules/drizzle-kit/**/*',
      './node_modules/esbuild/**/*',
      './node_modules/@esbuild/**/*',
      './node_modules/esbuild-register/**/*',
      './node_modules/@esbuild-kit/**/*',
    ],
  },
  async redirects() {
    return [
      { source: '/index', destination: '/', permanent: true },
      {
        source: '/detailed-article',
        destination: '/blog/distinctive-features-of-milano-nail-spa-in-flower-mound',
        permanent: true,
      },
      {
        source: '/appointment',
        destination: '/book',
        permanent: false,
      },
    ]
  },
  experimental: {
    reactCompiler: false,
  },
}

export default withPayload(nextConfig)
