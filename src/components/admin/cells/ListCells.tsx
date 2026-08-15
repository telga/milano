'use client'

/**
 * List-view cells that show plain language instead of raw stored values
 * (`true`, `false`, `<No Duration (minutes)>`).
 */

type CellProps = {
  cellData?: unknown
}

function Pill({ tone, children }: { tone: 'on' | 'off'; children: React.ReactNode }) {
  return <span className={`milano-pill milano-pill--${tone}`}>{children}</span>
}

export function OnWebsiteCell({ cellData }: CellProps) {
  return cellData ? <Pill tone="on">On website</Pill> : <Pill tone="off">Hidden</Pill>
}

export function YesNoCell({ cellData }: CellProps) {
  return cellData ? <Pill tone="on">Yes</Pill> : <Pill tone="off">No</Pill>
}

export function PriceCell({ cellData }: CellProps) {
  if (typeof cellData !== 'number') return <span className="milano-cell-empty">—</span>
  return <span>${cellData}</span>
}

export function MinutesCell({ cellData }: CellProps) {
  if (typeof cellData !== 'number') return <span className="milano-cell-empty">—</span>
  return <span>{cellData} min</span>
}
