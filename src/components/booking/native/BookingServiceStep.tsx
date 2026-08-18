'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { filterBookingCatalog, type CartService } from '@/lib/bookingFlow'

type BookingServiceStepProps = {
  services: CartService[]
  categories: string[]
  selectedIds: string[]
  guestCount: number
  maxGuestCount: number
  onToggle: (service: CartService) => void
  onGuestCountChange: (count: number) => void
}

export function BookingServiceStep({
  services,
  categories,
  selectedIds,
  guestCount,
  maxGuestCount,
  onToggle,
  onGuestCountChange,
}: BookingServiceStepProps) {
  const [query, setQuery] = useState('')
  const [openCategories, setOpenCategories] = useState<string[]>([])
  const groups = useMemo(
    () => filterBookingCatalog(services, categories, query),
    [categories, query, services],
  )
  const searching = query.trim().length > 0

  useEffect(() => {
    if (searching) {
      setOpenCategories(groups.map((group) => group.category))
      return
    }
    setOpenCategories([])
  }, [groups, searching])

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 01</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Choose Your Service</h2>
        <p className="mt-2 text-sm text-muted">
          Open a category, then select one or more treatments.
        </p>
      </div>

      <GuestCountPicker
        guestCount={guestCount}
        maxGuestCount={maxGuestCount}
        onGuestCountChange={onGuestCountChange}
      />

      <div>
        <label htmlFor="booking-service-search" className="text-[10px] uppercase tracking-[0.22em] text-muted">
          Search services
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            id="booking-service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Gel mani, pedicure…"
            autoComplete="off"
            className="w-full border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground transition-colors focus:border-gold focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted">No services match “{query.trim()}”.</p>
      ) : (
        <Accordion
          type="multiple"
          value={openCategories}
          onValueChange={setOpenCategories}
          className="w-full"
        >
        {groups.map(({ category, items }) => {
          const selectedCount = items.filter((item) => selectedIds.includes(item.id)).length
          return (
            <AccordionItem key={category} value={category}>
              <AccordionTrigger className="font-display text-base uppercase tracking-[0.12em] sm:text-lg">
                <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-3">
                  <span className="truncate">{category}</span>
                  <span className="shrink-0 text-[10px] font-normal tracking-[0.16em] text-muted">
                    {selectedCount > 0 ? `${selectedCount} selected · ` : ''}
                    {items.length} {items.length === 1 ? 'service' : 'services'}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((service) => {
                    const selected = selectedIds.includes(service.id)
                    return (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => onToggle(service)}
                        className={cn(
                          'luxury-card p-4 text-left transition-colors hover:border-gold/50',
                          selected && 'border-gold ring-1 ring-gold/30',
                        )}
                      >
                        <p className="text-sm font-medium text-foreground">{service.name}</p>
                        <div className="mt-2 flex items-center justify-between text-muted">
                          {service.durationMinutes ? (
                            <span className="text-sm">{service.durationMinutes} min</span>
                          ) : (
                            <span />
                          )}
                          {service.price != null ? (
                            <span className="text-base font-medium text-gold">${service.price}+</span>
                          ) : null}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
        </Accordion>
      )}
    </div>
  )
}

function GuestCountPicker({
  guestCount,
  maxGuestCount,
  onGuestCountChange,
}: {
  guestCount: number
  maxGuestCount: number
  onGuestCountChange: (count: number) => void
}) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const selectedRef = useRef<HTMLButtonElement>(null)
  const numbers = useMemo(
    () => Array.from({ length: maxGuestCount }, (_, index) => index + 1),
    [maxGuestCount],
  )

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    selectedRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const choose = (count: number) => {
    onGuestCountChange(count)
    setOpen(false)
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4 border border-border px-4 py-3">
        <div>
          <p id="guest-count-label" className="text-[10px] uppercase tracking-[0.22em] text-muted">
            Number of clients
          </p>
          <p className="mt-1 text-xs text-muted">Same services, booked together</p>
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`Number of clients, currently ${guestCount}. Change`}
          onClick={() => setOpen(true)}
          className="flex h-11 min-w-11 items-center justify-center border border-gold px-3 font-display text-xl text-gold transition-colors hover:bg-gold/10"
        >
          {guestCount}
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="luxury-card w-full max-w-sm bg-surface p-5 shadow-[var(--shadow-soft)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p id={titleId} className="font-display text-xl tracking-wide text-foreground">
                  Number of clients
                </p>
                <p className="mt-1 text-xs text-muted">Tap a number. Minimum 1.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center border border-border text-muted transition-colors hover:border-gold/50 hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {numbers.map((count) => {
                const selected = count === guestCount
                return (
                  <button
                    key={count}
                    type="button"
                    ref={selected ? selectedRef : undefined}
                    aria-pressed={selected}
                    onClick={() => choose(count)}
                    className={cn(
                      'flex h-11 items-center justify-center border font-display text-base transition-colors hover:border-gold/50',
                      selected
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-border text-foreground',
                    )}
                  >
                    {count}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
