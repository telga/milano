import { MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

import type { SiteSetting } from '@/payload-types'
import { BUSINESS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type AboutConnectProps = {
  links?: SiteSetting['socialLinks']
  className?: string
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M15 3h-3a5 5 0 0 0-5 5v3H4v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
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

type Action = {
  key: string
  label: string
  href: string
  icon: ReactNode
}

export function AboutConnect({ links, className }: AboutConnectProps) {
  const facebook = links?.find((link) => link.platform === 'facebook')?.url
  const instagram = links?.find((link) => link.platform === 'instagram')?.url

  const actions: Action[] = [
    facebook
      ? {
          key: 'facebook',
          label: 'Facebook',
          href: facebook,
          icon: <FacebookIcon className="h-4 w-4" />,
        }
      : null,
    instagram
      ? {
          key: 'instagram',
          label: 'Instagram',
          href: instagram,
          icon: <InstagramIcon className="h-4 w-4" />,
        }
      : null,
    {
      key: 'maps',
      label: 'Google Maps',
      href: BUSINESS.mapsUrl,
      icon: <MapPin className="h-4 w-4" aria-hidden />,
    },
  ].filter(Boolean) as Action[]

  if (!actions.length) return null

  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center', className)}>
      {actions.map((action) => (
        <a
          key={action.key}
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2.5 border border-gold px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-background sm:w-auto"
        >
          {action.icon}
          {action.label}
        </a>
      ))}
    </div>
  )
}
