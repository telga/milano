# Security Checklist — Milano Nail Spa

## Application

- [x] Admin routes protected by Payload authentication
- [x] Security headers via Next.js middleware (CSP, HSTS prod, X-Frame-Options)
- [x] Secrets in environment variables only (never committed)
- [x] Upload MIME whitelist on Media collection
- [x] Revalidation endpoint protected by `REVALIDATION_SECRET`
- [x] Public API read-only (no anonymous writes)

## Production (before go-live)

- [ ] Change default admin password
- [ ] Remove `ADMIN_PASSWORD` from Vercel env after seed
- [ ] Enable Cloudflare WAF + rate limiting on `/admin` and `/api`
- [ ] SSL Full (strict) on Cloudflare
- [ ] Enable Neon PITR backups
- [ ] Enable Dependabot on GitHub repo
- [ ] Configure Sentry for error alerts
- [ ] Review CSP if adding third-party scripts

## Ongoing

- Monthly `npm audit` review
- Rotate `PAYLOAD_SECRET` and `REVALIDATION_SECRET` if compromised
- Limit admin users to 2–3 accounts
- Monitor `/api/health` uptime

## Cloudflare WAF (document rules in dashboard)

1. **Rate limiting:** `/admin/*` — 30 requests/minute/IP
2. **Rate limiting:** `/api/*` — 100 requests/minute/IP
3. **Managed rules:** Cloudflare OWASP Core Ruleset enabled
