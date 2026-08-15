import Link from 'next/link'

/**
 * Pinned above the generated nav so the two things staff need most —
 * the task list and the hours/contact settings — are never buried.
 */
const SHORTCUTS = [
  { label: 'Start here', href: '/admin' },
  { label: 'Hours & contact', href: '/admin/globals/site-settings' },
]

export default function AdminQuickLinks() {
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <div className="milano-nav-shortcuts">
      <p className="milano-nav-shortcuts__title">Shortcuts</p>
      <ul>
        {SHORTCUTS.map((shortcut) => (
          <li key={shortcut.href}>
            <Link href={shortcut.href}>{shortcut.label}</Link>
          </li>
        ))}
        <li>
          <a href={siteUrl} target="_blank" rel="noreferrer">
            View live website ↗
          </a>
        </li>
      </ul>
    </div>
  )
}
