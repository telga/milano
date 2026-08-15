'use client'

import { useRowLabel } from '@payloadcms/ui'

/** Shows the text of an array row so collapsed rows still make sense. */
export function BulletRowLabel() {
  const { data, rowNumber } = useRowLabel<{ text?: string }>()
  return <span>{data?.text || `Item ${String((rowNumber ?? 0) + 1)}`}</span>
}

export function HoursRowLabel() {
  const { data, rowNumber } = useRowLabel<{ label?: string; value?: string }>()
  if (!data?.label && !data?.value) return <span>{`Row ${String((rowNumber ?? 0) + 1)}`}</span>
  return <span>{[data.label, data.value].filter(Boolean).join(' · ')}</span>
}
