import type { ServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'

import AdminBookingToggle from '@/components/admin/AdminBookingToggle'
import { getUserRole, isAdmin } from '@/payload/access'

type Task = {
  title: string
  description: string
  href: string
  action: string
}

const EDITOR_TASKS: Task[] = [
  {
    title: 'Change opening hours or phone',
    description: 'Hours, phone, email, address, and the About paragraph.',
    href: '/admin/globals/site-settings',
    action: 'Edit details',
  },
  {
    title: 'Add or edit a service',
    description: 'Treatment names, prices, how long they take, and what’s included.',
    href: '/admin/collections/services',
    action: 'Open service list',
  },
  {
    title: 'Swap a photo on the website',
    description: 'Pick the spot you want to change, choose a photo, save.',
    href: '/admin/collections/site-image-slots',
    action: 'Choose a photo spot',
  },
  {
    title: 'Add a gallery photo',
    description: 'Show off nail art or the salon on the Gallery page.',
    href: '/admin/collections/gallery-items/create',
    action: 'Upload photo',
  },
  {
    title: 'Put a notice on the homepage',
    description: 'Holiday hours or news, shown once as a popup.',
    href: '/admin/collections/popup-announcements',
    action: 'Manage notices',
  },
  {
    title: 'Write a blog post',
    description: 'Save as a draft first, publish when you’re happy with it.',
    href: '/admin/collections/blog-posts/create',
    action: 'Start writing',
  },
]

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="milano-admin-stat">
      <p className="milano-admin-stat__value">{value}</p>
      <p className="milano-admin-stat__label">{label}</p>
    </div>
  )
}

export default async function AdminDashboard(props: ServerProps) {
  const { payload, user } = props
  const role = getUserRole(user)
  const admin = isAdmin(user)

  const [services, gallery, drafts, announcements, categories, siteSettings] = await Promise.all([
    payload.count({ collection: 'services', overrideAccess: false, user }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: 'gallery-items', overrideAccess: false, user }).catch(() => ({ totalDocs: 0 })),
    payload.count({
      collection: 'blog-posts',
      where: { status: { equals: 'draft' } },
      overrideAccess: false,
      user,
    }).catch(() => ({ totalDocs: 0 })),
    payload.find({
      collection: 'popup-announcements',
      where: {
        and: [{ active: { equals: true } }, { published: { equals: true } }],
      },
      limit: 1,
      depth: 0,
      overrideAccess: false,
      user,
    }).catch(() => ({ docs: [] })),
    payload.count({ collection: 'service-categories', overrideAccess: false, user }).catch(() => ({ totalDocs: 0 })),
    payload.findGlobal({ slug: 'site-settings', overrideAccess: true }).catch(() => null),
  ])

  const activeAnnouncement = announcements.docs[0] as { id?: number | string; title?: string } | undefined
  const customBooking = Boolean(
    siteSettings && 'useCustomBookingFrontend' in siteSettings && siteSettings.useCustomBookingFrontend,
  )
  const nativeBooking = Boolean(
    siteSettings &&
      'useNativeAbcBooking' in siteSettings &&
      siteSettings.useNativeAbcBooking &&
      customBooking,
  )

  return (
    <Gutter className="milano-admin-dashboard">
      <header className="milano-admin-dashboard__header">
        <div>
          <p className="milano-admin-dashboard__eyebrow">Milano Nail Spa</p>
          <h1 className="milano-admin-dashboard__title">What would you like to update?</h1>
          <p className="milano-admin-dashboard__intro">
            Pick a task below. Every change saves straight to the live website, and you can always
            turn something off again instead of deleting it.
          </p>
        </div>
        <a className="milano-admin-dashboard__live" href="/" target="_blank" rel="noreferrer">
          View live website
        </a>
      </header>

      <AdminBookingToggle />

      <section className="milano-admin-tasks" aria-label="Common tasks">
        {EDITOR_TASKS.map((task) => (
          <Link key={task.href} className="milano-admin-task" href={task.href}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <span className="milano-admin-task__action">{task.action} →</span>
          </Link>
        ))}
      </section>

      <section className="milano-admin-dashboard__status" aria-label="Website status">
        <h2>Right now</h2>
        <p className="milano-admin-dashboard__notice">
          Booking:{' '}
          <strong>
            {nativeBooking
              ? 'Native Milano wizard'
              : customBooking
                ? 'Custom page (iframe)'
                : 'ABC Salon link'}
          </strong>
          . <Link href="/admin/globals/site-settings">Change in settings</Link>
        </p>
        <p className="milano-admin-dashboard__notice">
          {activeAnnouncement ? (
            <>
              Homepage popup is <strong>on</strong>: “{activeAnnouncement.title}”.{' '}
              <Link href="/admin/collections/popup-announcements">Change or turn it off</Link>
            </>
          ) : (
            <>
              No homepage popup is showing.{' '}
              <Link href="/admin/collections/popup-announcements/create">Add one</Link>
            </>
          )}
        </p>
        <div className="milano-admin-dashboard__stats">
          <StatCard label="Service categories" value={categories.totalDocs} />
          <StatCard label="Services" value={services.totalDocs} />
          <StatCard label="Gallery photos" value={gallery.totalDocs} />
          <StatCard label="Unpublished drafts" value={drafts.totalDocs} />
        </div>
      </section>

      <section className="milano-admin-dashboard__more">
        <h2>Less often</h2>
        <ul>
          <li>
            <Link href="/admin/collections/service-categories">Service categories</Link>
          </li>
          <li>
            <Link href="/admin/collections/promotions">Promotions</Link>
          </li>
          <li>
            <Link href="/admin/collections/specialties">Specialty designs</Link>
          </li>
          <li>
            <Link href="/admin/collections/media">All uploaded photos</Link>
          </li>
          {admin && (
            <li>
              <Link href="/admin/collections/users">Staff logins</Link>
            </li>
          )}
        </ul>
        <p className="milano-admin-dashboard__role">
          Signed in as {role === 'admin' ? 'an admin' : 'an editor'}
          {admin
            ? ' — you can also manage staff logins and the booking link.'
            : ' — technical settings are hidden to keep things simple.'}
        </p>
      </section>
    </Gutter>
  )
}
