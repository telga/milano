# Milano Nail Spa — Website

Enterprise website for [Milano Nail Spa Flower Mound](https://milanonailspaflowermound.com) built with **Next.js 15** + **Payload CMS 3**.

## Stack

- **Frontend:** Next.js App Router, Tailwind CSS v4
- **CMS / Admin:** Payload CMS at `/admin`
- **Database:** SQLite (local dev) or Neon Postgres (production)
- **Images:** Payload media + optional Cloudinary CDN
- **Booking:** ABC Salon POS — optional Milano-branded facade at `/book`; native 5-step wizard when both booking toggles are on in admin

## Quick Start

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run scrape               # Download 60+ photos from legacy site
npm run dev                  # http://localhost:3000 — creates SQLite schema on first run
```

**First-time database seed** (with dev server running):

```bash
# Option A — auto on empty DB (SEED_ON_START=true in .env.local)
curl http://localhost:3000/api/bootstrap

# Option B — manual
curl -X POST http://localhost:3000/api/seed -H "x-seed-secret: dev-seed-secret"
```

**Admin:** `/admin` — default login `admin` / `ChangeMe123!` (change immediately; email is optional on staff accounts)

**Classic single-page layout** (optional preview of original scroll-style site):

```bash
# Add to .env.local
NEXT_PUBLIC_CLASSIC_LAYOUT=true
```

Restart the dev server. The homepage shows all sections on one scrollable page; other routes redirect to anchor links.

> **Note:** Payload CLI commands (`generate:importmap`, standalone `tsx` seed) may fail on Node.js 24+. Use the API seed routes above, or Node 20 LTS for CLI tools. Production uses Neon Postgres via `DATABASE_URI`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run scrape` | Crawl legacy site & download images |
| `npm run migrate:images` | Upload scraped images to Cloudinary (optional) |
| `npm run seed` | Seed CMS with services, blog, photos |
| `npm run fix:images` | Reassign distinct images to each photo slot |
| `npm run generate:types` | Regenerate Payload TypeScript types |
| `npm run test:e2e` | Playwright smoke tests |

## Project Structure

```
src/
  app/(frontend)/     Public pages
  app/(payload)/      Payload admin + API
  collections/        CMS collections
  components/         UI components
  lib/                Data fetchers, utilities
scripts/
  scrape-legacy-images.ts
  seed-content.ts
  data/services.ts
docs/                 Deployment & admin guides
```

## Documentation

- [How to Use the Admin Portal](docs/HOW_TO_USE_ADMIN.md) — Plain-language guide for salon staff
- [Admin Guide](docs/ADMIN_GUIDE.md) — Technical CMS reference
- [How Native Booking Works](docs/HOW_NATIVE_BOOKING_WORKS.md) — Shareholder overview of Milano booking + ABC
- [How to host a live demo](docs/HOW_TO_HOST_A_DEMO.md) — Free Vercel + Neon staging URL for walkthroughs
- [Deployment](docs/DEPLOYMENT.md) — Vercel + Neon + Cloudflare production setup
- [Security](docs/SECURITY.md) — Security checklist

## License

Proprietary — Milano Nail Spa Flower Mound
