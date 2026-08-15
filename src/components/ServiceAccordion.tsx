'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { Service, ServiceCategory } from '@/payload-types'
import { slugify } from '@/lib/utils'

type ServiceAccordionProps = {
  groups: Array<{ category: ServiceCategory; services: Service[] }>
}

function categoryAnchor(category: ServiceCategory) {
  return `cat-${category.slug || slugify(category.name)}`
}

function hashCategoryId() {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  return hash.startsWith('cat-') ? hash : null
}

export function ServiceAccordion({ groups }: ServiceAccordionProps) {
  const [open, setOpen] = useState<string[]>([])

  const openFromHash = useCallback(() => {
    const hash = hashCategoryId()
    if (!hash) return

    const match = groups.find(({ category }) => categoryAnchor(category) === hash)
    if (!match) return

    const value = String(match.category.id)
    setOpen((prev) => (prev.includes(value) ? prev : [...prev, value]))

    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [groups])

  useEffect(() => {
    openFromHash()
    window.addEventListener('hashchange', openFromHash)

    const onOpenService = (event: Event) => {
      const hash = (event as CustomEvent<{ hash?: string }>).detail?.hash
      if (!hash?.startsWith('cat-')) return
      if (window.location.hash !== `#${hash}`) {
        window.location.hash = hash
      } else {
        openFromHash()
      }
    }

    window.addEventListener('milano:open-service', onOpenService)
    return () => {
      window.removeEventListener('hashchange', openFromHash)
      window.removeEventListener('milano:open-service', onOpenService)
    }
  }, [openFromHash])

  if (!groups.length) {
    return <p className="text-muted">Services menu coming soon.</p>
  }

  return (
    <Accordion type="multiple" value={open} onValueChange={setOpen} className="w-full">
      {groups.map(({ category, services }) => {
        const anchor = categoryAnchor(category)
        return (
          <AccordionItem key={category.id} value={String(category.id)} id={anchor} className="scroll-mt-28">
            <AccordionTrigger>{category.name}</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-6">
                {services.map((service) => (
                  <li key={service.id} className="border-l border-gold/40 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-xl leading-snug text-foreground sm:text-2xl">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        {service.durationMinutes ? (
                          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/80">
                            {service.durationMinutes} min
                          </span>
                        ) : null}
                        {service.showPrice && service.price != null ? (
                          <span className="text-sm text-gold">${service.price}</span>
                        ) : null}
                      </div>
                    </div>
                    {service.description && (
                      <p className="mt-2 text-sm leading-relaxed text-muted">{service.description}</p>
                    )}
                    {service.bullets && service.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5 text-sm text-muted">
                        {service.bullets.map((bullet, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                            <span>{typeof bullet === 'object' ? bullet.text : bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
