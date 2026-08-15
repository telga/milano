# Production Deployment — Milano Nail Spa

## Prerequisites

- GitHub repository connected to Vercel
- [Neon](https://neon.tech) Postgres database (Launch plan recommended)
- [Cloudflare](https://cloudflare.com) account with domain DNS
- Optional: [Cloudinary](https://cloudinary.com) for image CDN

## 1. Neon Postgres

1. Create project **milano-prod**
2. Copy connection string → `DATABASE_URI`
3. Enable point-in-time recovery (PITR)

## 2. Vercel

1. Import GitHub repo
2. Framework: **Next.js**
3. Environment variables:

| Variable | Value |
|----------|-------|
| `PAYLOAD_SECRET` | Random 32+ char string |
| `DATABASE_URI` | Neon connection string |
| `NEXT_PUBLIC_SERVER_URL` | `https://milanonailspaflowermound.com` |
| `REVALIDATION_SECRET` | Random secret |
| `ADMIN_USERNAME` | Initial admin username (remove after seed) |
| `ADMIN_EMAIL` | Optional initial admin email (remove after seed) |
| `ADMIN_PASSWORD` | Initial admin password (remove after seed) |
| `CLOUDINARY_*` | If using Cloudinary |

4. Deploy → upgrade to **Pro** for SLA

## 3. Seed Production Database

From local machine with production `DATABASE_URI`:

```bash
npm run scrape
npm run migrate:images   # optional Cloudinary
DATABASE_URI="..." npm run seed
```

Remove `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` from Vercel after seeding.

## 4. Cloudflare DNS

1. Add domain to Cloudflare
2. CNAME `@` or `www` → `cname.vercel-dns.com` (per Vercel instructions)
3. Enable **Proxied** (orange cloud)
4. SSL/TLS → **Full (strict)**
5. Enable WAF managed rules (Pro plan)

### Recommended WAF rules

- Rate limit `/admin/*` — 30 req/min per IP
- Rate limit `/api/*` — 100 req/min per IP
- Block countries if needed (optional)

## 5. Post-Launch Checklist

- [ ] Verify all pages load with images
- [ ] Test Book Now → ABC POS link
- [ ] Admin login at `/admin`
- [ ] Submit sitemap in Google Search Console
- [ ] Set up [UptimeRobot](https://uptimerobot.com) or Better Stack on `/api/health`
- [ ] Set up [Sentry](https://sentry.io) for error tracking
- [ ] Lower DNS TTL 24h before cutover, then point domain to Vercel

## 6. Rollback

```bash
vercel rollback
```

Or revert DNS to previous host if needed.

## CI/CD

GitHub Actions runs lint + build on every PR. Merging to `main` auto-deploys via Vercel.
