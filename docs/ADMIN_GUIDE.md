# Milano Nail Spa — Admin Guide

## Login

1. Go to **your-site.com/admin**
2. Sign in with your admin **username** and password (email is optional on staff accounts)
3. Change your password after first login

The dashboard is task-oriented for salon staff. Editors see content workflows only; Admins also see Staff Logins and Advanced Site Settings.

## Roles

- **editor** (`role` on Users, `saveToJWT: true`) — content, photos, hours; cannot manage Users or Advanced settings
- **admin** — full access including Users, creating/deleting fixed image slots, booking URL, SEO

## Change Photos on the Website

### Fixed photo spots

1. Open **Photos → Website Photo Spots**
2. Each row is labeled by page and position (e.g. "Home — Hero")
3. Click a row → choose a **Photo**, or enable **Use grey crosshatch placeholder** → **Save**
4. **Home — Hero** also has an optional **Photo (dark mode)**. `SlotImage` switches between it and the light/default image using the root `.dark` theme class.
5. The placeholder flag keeps both selected images stored and makes `SlotImage` use `/images/placeholder.svg`

### Navigation visibility

Open **Website Basics → Hours & Contact → Navigation** and select any pages that should not appear in the header or footer. This only hides menu links; direct page URLs remain available.

### Service card icons

Open **Website Basics → Hours & Contact → Service cards** and enable **Hide icons on service cards** to remove the decorative icons site-wide.
5. Changes appear on the live site within ~1 minute

Editors can update images; only Admins create/delete slot documents.

### Gallery page photos

1. Open **Photos → Gallery Photos**
2. To add: **Create New** → upload image, optional caption, set **Order on page** (lower = first)
3. To remove: open item → **Delete**
4. To reorder: edit **Order on page** numbers

## Blog Posts

1. Open **Marketing → Blog Posts**
2. **Create New** or edit existing post
3. Set **Status** to **Published**; **Publish date** auto-fills on first publish if empty
4. Slug auto-generates from title
5. **Save** — post appears at `/blog/your-slug`

## Services Menu

1. Open **Services → Service Categories** to add/rename/reorder categories (slug auto-fills)
2. Open **Services → Services** to add/edit individual services
3. **Show price to customers** is off by default
4. Use **Order on page** and **Show on website**
5. The list is sorted by category and searchable by name/description

## Promotions & Specialty Designs

- **Marketing → Promotions**
- **Marketing → Specialty Designs**

## Homepage Announcements

1. Open **Marketing → Homepage Announcements**
2. Fill the *What it says* + *When it shows* tabs
3. Tick **Showing on website** — a `beforeChange` hook mirrors it to the stored `published` field, so staff only manage one switch
4. Optional start/end dates

## Hours & Contact

**Website Basics → Hours & Contact** — Contact / Hours / Website text / Advanced (Admin)

## Admin UI customisations

All registered in `payload.config.ts` (and mirrored in `src/app/(payload)/admin/importMap.js`):

| Piece | File | Purpose |
|-------|------|---------|
| Dashboard | `src/components/admin/AdminDashboard.tsx` | Task-based home screen (`admin.components.views.dashboard`) |
| Sidebar shortcuts | `src/components/admin/AdminQuickLinks.tsx` | Pinned links via `admin.components.beforeNavLinks` |
| Branding | `src/components/admin/AdminBrand.tsx` | Logo and icon |
| List cells | `src/components/admin/cells/ListCells.tsx` | Renders `On website` / `Hidden`, `Yes` / `No`, `$45`, `45 min` instead of raw values |
| Category cell | `src/components/admin/cells/CategoryCell.tsx` | Server-rendered category name (Payload's client-side relationship lookup only fills the first rows on large pages) |
| Photo cell | `src/components/admin/cells/PhotoCell.tsx` | Server-rendered list thumbnails, same reason |
| Row labels | `src/components/admin/cells/RowLabels.tsx` | Readable titles for hours and service-bullet array rows |
| Shared list defaults | `src/payload/adminFields.ts` (`friendlyList`) | `hideAPIURL` plus 50-per-page pagination for every collection |
| Styling | `src/app/(payload)/custom.scss` | Dashboard, shortcuts, pills, thumbnails, roomier rows |

## Need Help?

Contact your developer if you cannot log in or images fail to upload.

**Staff-friendly guide:** [HOW_TO_USE_ADMIN.md](HOW_TO_USE_ADMIN.md)
