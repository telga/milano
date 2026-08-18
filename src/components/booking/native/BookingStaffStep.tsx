'use client'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

type StaffOption = { id: string; name: string }

type BookingStaffStepProps = {
  staff: StaffOption[]
  staffMode: 'choose' | 'any'
  staffId: string | null
  onModeChange: (mode: 'choose' | 'any') => void
  onStaffSelect: (id: string, name: string) => void
}

export function BookingStaffStep({
  staff,
  staffMode,
  staffId,
  onModeChange,
  onStaffSelect,
}: BookingStaffStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow mb-2">Step 02</p>
        <h2 className="font-display text-2xl tracking-wide text-foreground">Choose Your Preference</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onModeChange('choose')}
          className={cn(
            'luxury-card flex items-start gap-3 p-5 text-left',
            staffMode === 'choose' && 'border-gold ring-1 ring-gold/30',
          )}
        >
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border',
              staffMode === 'choose' ? 'border-gold bg-gold text-background' : 'border-border',
            )}
          >
            {staffMode === 'choose' ? <Check className="h-3 w-3" /> : null}
          </span>
          <span>
            <span className="block text-sm font-medium">I&apos;ll choose my staff</span>
            <span className="mt-1 block text-xs text-muted">Pick your preferred technician</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('any')}
          className={cn(
            'luxury-card flex items-start gap-3 p-5 text-left',
            staffMode === 'any' && 'border-gold ring-1 ring-gold/30',
          )}
        >
          <span
            className={cn(
              'mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border',
              staffMode === 'any' ? 'border-gold bg-gold text-background' : 'border-border',
            )}
          >
            {staffMode === 'any' ? <Check className="h-3 w-3" /> : null}
          </span>
          <span>
            <span className="block text-sm font-medium">Any available staff</span>
            <span className="mt-1 block text-xs text-muted">First opening that fits your time</span>
          </span>
        </button>
      </div>

      {staffMode === 'choose' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((member) => (
            <button
              key={member.id}
              type="button"
              onClick={() => onStaffSelect(member.id, member.name)}
              className={cn(
                'luxury-card p-4 text-left text-sm transition-colors hover:border-gold/50',
                staffId === member.id && 'border-gold ring-1 ring-gold/30',
              )}
            >
              {member.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
