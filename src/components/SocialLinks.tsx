import { Globe } from 'lucide-react'

import type { SiteSetting } from '@/payload-types'
import { cn } from '@/lib/utils'

type SocialLinksProps = {
  links?: SiteSetting['socialLinks']
  className?: string
}

const LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  google: 'Google',
}

function SocialGlyph({ platform }: { platform: string }) {
  if (platform === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
        <path d="M15 3h-3a5 5 0 0 0-5 5v3H4v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  }

  if (platform === 'instagram') {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
      </svg>
    )
  }

  return <Globe className="h-4 w-4" aria-hidden />
}

export function SocialLinks({ links, className }: SocialLinksProps) {
  if (!links?.length) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-3', className)}>
      {links.map((link) => (
        <li key={link.id || `${link.platform}-${link.url}`}>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[link.platform] || 'Social profile'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-background transition-colors hover:bg-gold-light"
          >
            <SocialGlyph platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  )
}
