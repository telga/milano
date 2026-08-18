'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useReducer, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  canContinue,
  estimateDuration,
  initialNativeBookingState,
  maxGuestCountForStaff,
  nativeBookingReducer,
  nextStep,
  prevStep,
  type CartService,
  type NativeBookingStep,
} from '@/lib/bookingFlow'
import type { AvailabilitySlot } from '@/lib/abc-booking/types'
import { trackClientEvent } from '@/lib/metrics/client'

import { BookingConfirmStep } from './BookingConfirmStep'
import { BookingDateTimeStep } from './BookingDateTimeStep'
import { BookingDetailsStep } from './BookingDetailsStep'
import { BookingHero } from './BookingHero'
import { BookingOrderSummary } from './BookingOrderSummary'
import { BookingProgress } from './BookingProgress'
import { BookingServiceStep } from './BookingServiceStep'
import { BookingStaffStep } from './BookingStaffStep'

type BookingWizardProps = {
  phone?: string
  fallbackUrl: string
}

type StaffOption = { id: string; name: string }

export function BookingWizard({ phone, fallbackUrl }: BookingWizardProps) {
  const [state, dispatch] = useReducer(nativeBookingReducer, initialNativeBookingState)
  const [staff, setStaff] = useState<StaffOption[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [dayOpen, setDayOpen] = useState<boolean | null>(null)
  const [dayHours, setDayHours] = useState<{ from: string; to: string } | undefined>()

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      dispatch({ type: 'SET_LOADING', loading: true })
      try {
        const [sessionRes, servicesRes] = await Promise.all([
          fetch('/api/booking/session', { method: 'POST' }),
          fetch('/api/booking/services'),
        ])

        if (!sessionRes.ok || !servicesRes.ok) {
          throw new Error('Could not load booking data')
        }

        const sessionJson = (await sessionRes.json()) as {
          sessionId: string
          staff: StaffOption[]
        }
        const servicesJson = (await servicesRes.json()) as {
          services: CartService[]
          categories: string[]
        }

        if (cancelled) return

        dispatch({ type: 'SET_SESSION', sessionId: sessionJson.sessionId })
        dispatch({ type: 'SET_SERVICES', services: servicesJson.services })
        setStaff(sessionJson.staff)
        setCategories(servicesJson.categories)
      } catch {
        if (!cancelled) {
          dispatch({
            type: 'SET_ERROR',
            error: 'Booking is temporarily unavailable. Please use ABC Salon directly.',
          })
          trackClientEvent({ type: 'booking_fallback', status: 'forced', path: '/book' })
        }
      } finally {
        if (!cancelled) dispatch({ type: 'SET_LOADING', loading: false })
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const maxGuestCount = maxGuestCountForStaff(staff.length)

  useEffect(() => {
    if (state.guestCount > maxGuestCount) {
      dispatch({ type: 'SET_GUEST_COUNT', count: maxGuestCount, max: maxGuestCount })
    }
  }, [maxGuestCount, state.guestCount])

  const loadAvailability = useCallback(
    async (
      date: string,
      sessionId: string | null,
      serviceIds: string[],
      durationMinutes: number,
      guestCount: number,
      selectedTime: string | null,
    ) => {
      if (!date || !sessionId) return
      setSlotsLoading(true)
      dispatch({ type: 'SET_ERROR', error: null })
      try {
        const res = await fetch('/api/booking/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            date,
            serviceIds,
            durationMinutes,
            guestCount,
          }),
        })
        const json = (await res.json()) as {
          error?: string
          open?: boolean
          hours?: { from: string; to: string }
          slots?: AvailabilitySlot[]
        }
        if (!res.ok) throw new Error(json.error || 'Availability check failed')
        const nextSlots = json.slots ?? []
        setDayOpen(json.open ?? true)
        setDayHours(json.hours)
        setSlots(nextSlots)
        if (selectedTime && !nextSlots.some((slot) => slot.time === selectedTime)) {
          dispatch({ type: 'CLEAR_TIME' })
        }
      } catch {
        setSlots([])
        setDayOpen(null)
        dispatch({
          type: 'SET_ERROR',
          error: 'Could not load available times. Try another day or book on ABC Salon.',
        })
      } finally {
        setSlotsLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    if (!state.date || !state.sessionId) return
    void loadAvailability(
      state.date,
      state.sessionId,
      state.serviceIds,
      estimateDuration(state.services, state.serviceIds) || 30,
      state.guestCount,
      state.time,
    )
  }, [
    loadAvailability,
    state.date,
    state.guestCount,
    state.serviceIds,
    state.services,
    state.sessionId,
  ])

  useEffect(() => {
    trackClientEvent({ type: 'booking_step', step: state.step, path: '/book' })
  }, [state.step])

  const goNext = useCallback(async () => {
    if (!canContinue(state)) return
    const following = nextStep(state.step)
    if (!following) return
    dispatch({ type: 'SET_STEP', step: following })
  }, [state])

  const goBack = useCallback(() => {
    const previous = prevStep(state.step)
    if (previous) dispatch({ type: 'SET_STEP', step: previous })
  }, [state.step])

  const handleSubmit = useCallback(async () => {
    if (!state.sessionId) return
    setSubmitting(true)
    dispatch({ type: 'SET_ERROR', error: null })

    try {
      const res = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: state.sessionId,
          serviceIds: state.serviceIds,
          staffId: state.staffId,
          date: state.date,
          timeBand: state.timeBand,
          time: state.time,
          name: state.name,
          phone: state.phone,
          comment: state.comment,
          staffName: state.staffName,
          guestCount: state.guestCount,
        }),
      })

      const json = (await res.json()) as {
        error?: string
        fallbackUrl?: string
        ok?: boolean
        message?: string
      }

      if (!res.ok) {
        dispatch({
          type: 'SET_ERROR',
          error: json.error || 'Could not send the appointment. Please try ABC Salon booking.',
        })
        if (res.status !== 429 && json.fallbackUrl) {
          trackClientEvent({ type: 'booking_fallback', status: 'forced', path: '/book' })
          window.open(json.fallbackUrl, '_blank', 'noopener,noreferrer')
        }
        return
      }

      setSubmitted(true)
      dispatch({ type: 'SET_ERROR', error: null })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Submission failed. Please try ABC Salon booking.' })
    } finally {
      setSubmitting(false)
    }
  }, [state])

  const renderStep = (step: NativeBookingStep) => {
    switch (step) {
      case 'service':
        return (
          <BookingServiceStep
            services={state.services}
            categories={categories}
            selectedIds={state.serviceIds}
            guestCount={state.guestCount}
            maxGuestCount={maxGuestCount}
            onToggle={(service) => {
              dispatch({ type: 'TOGGLE_SERVICE', service })
              if (!state.serviceIds.includes(service.id)) {
                trackClientEvent({
                  type: 'service_select',
                  serviceKey: service.name,
                  category: service.displayCategory || service.category,
                  path: '/book',
                })
              }
            }}
            onGuestCountChange={(count) =>
              dispatch({ type: 'SET_GUEST_COUNT', count, max: maxGuestCount })
            }
          />
        )
      case 'staff':
        return (
          <BookingStaffStep
            staff={staff}
            staffMode={state.staffMode}
            staffId={state.staffId}
            onModeChange={(mode) => dispatch({ type: 'SET_STAFF_MODE', mode })}
            onStaffSelect={(id, name) => dispatch({ type: 'SET_STAFF', staffId: id, staffName: name })}
          />
        )
      case 'datetime':
        return (
          <BookingDateTimeStep
            date={state.date}
            time={state.time}
            loading={slotsLoading}
            open={dayOpen}
            hours={dayHours}
            slots={slots}
            onDateChange={(date) => dispatch({ type: 'SET_DATE', date })}
            onTimeChange={(slot) => dispatch({ type: 'SET_TIME', time: slot.time, band: slot.band })}
          />
        )
      case 'details':
        return (
          <BookingDetailsStep
            name={state.name}
            phone={state.phone}
            comment={state.comment}
            onChange={(fields) => dispatch({ type: 'SET_DETAILS', ...fields })}
          />
        )
      case 'confirm':
        return (
          <BookingConfirmStep
            state={state}
            fallbackUrl={fallbackUrl}
            onSubmit={() => void handleSubmit()}
            onFallback={() => trackClientEvent({ type: 'booking_fallback', status: 'click', path: '/book' })}
            submitting={submitting}
            submitted={submitted}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <BookingHero phone={phone} />
      <BookingProgress current={state.step} />

      <section className="section-pad">
        <div className="container-luxury">
          {state.error && (
            <div
              className="mb-6 border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-foreground"
              role="alert"
            >
              {state.error}{' '}
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline"
                onClick={() => trackClientEvent({ type: 'booking_fallback', status: 'click', path: '/book' })}
              >
                Open ABC Salon booking
              </a>
            </div>
          )}

          {state.loading && !state.services.length ? (
            <p className="text-center text-sm text-muted">Loading booking options…</p>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
              <div className="min-w-0">
                {renderStep(state.step)}

                {state.step !== 'confirm' && !submitted && (
                  <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
                    {prevStep(state.step) ? (
                      <Button type="button" variant="outline" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        Back
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      onClick={() => void goNext()}
                      disabled={!canContinue(state) || state.loading}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                )}
              </div>

              <BookingOrderSummary state={state} className="hidden lg:flex" />
            </div>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-muted lg:hidden">
            Appointments are confirmed by SMS from Milano Nail Spa.
          </p>
        </div>
      </section>
    </>
  )
}
