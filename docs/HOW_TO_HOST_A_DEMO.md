# How to host a live demo (free)

This is a personal checklist for putting a **test copy** of the Milano site on the public internet so shareholders can click around. It is **not** the real production site.

You will not use your home server. Everything below is **free** if you stay on the free plans.

When you are done you will have a link like:

`https://milano-demo-xxxx.vercel.app`

That **is** your free domain. SSL is included. You do not need to buy a `.com` for this.

Production (paid domain, Cloudflare, etc.) is a different path: [DEPLOYMENT.md](DEPLOYMENT.md).

---

## What this demo can show

- The Milano website look and pages
- Admin at `/admin`
- Native booking on `/book` (if you turn the admin toggles on)
- Services, hours, and layout after you seed content

## What this demo should not do

- Do **not** turn on live ABC submit (`ABC_BOOKING_ENABLED=true`) unless you are ready for a **real** appointment in the salon calendar
- Do **not** use the default password `ChangeMe123!` on a public URL
- Do **not** treat this as the final production host
- Photos may be placeholders unless you add Cloudinary later (explained below)

The URL is unlisted, not secret. Anyone who has the link can open the public pages. Keep the admin password to yourself.

---

## What you will sign up for (all free)

| Account | Why | Free domain / URL |
|---------|-----|-------------------|
| [GitHub](https://github.com) | Holds the code Vercel deploys | — |
| [Vercel](https://vercel.com) | Runs the Next.js + Payload site | `*.vercel.app` |
| [Neon](https://neon.tech) | Postgres database in the cloud | — |

SQLite on your PC (`milano.db`) **cannot** go to Vercel. Vercel’s machines have no lasting disk. Neon is the free stand-in.

Optional later: [Cloudinary](https://cloudinary.com) free tier if you want photos that survive deploys. Skip it for a first booking-UI demo.

Time budget: about **45–90 minutes** the first time.

---

## Step 1 — GitHub repo

The code must live on GitHub so Vercel can pull it.

1. Sign in at [github.com](https://github.com).
2. If this project is not already a GitHub repo:
   - On GitHub click **New repository**
   - Name it something like `milano-demo`
   - Keep it **Private**
   - Do **not** add a README (you already have one)
3. From this project folder, add the remote and push (use your real repo URL):

```bash
git remote add origin https://github.com/YOUR_USER/milano-demo.git
git push -u origin HEAD
```

If `origin` already exists and points at GitHub, just:

```bash
git push -u origin HEAD
```

Confirm `.env` and `.env.local` are **not** in the repo. They are gitignored on purpose.

---

## Step 2 — Neon database

1. Open [neon.tech](https://neon.tech) and sign up (GitHub login is fine).
2. Create a project. Name it `milano-demo`. Region: **US East** (or closest to Texas).
3. Open **Dashboard → Connection details**.
4. Choose the **pooled** connection (the host usually contains `-pooler`). Serverless hosts need this.
5. Copy the connection string. It looks like:

```
postgresql://USER:PASSWORD@HOST/neondb?sslmode=require
```

Keep this private. You will paste it into Vercel as `DATABASE_URI`.

Neon’s free plan may **sleep** after inactivity. The first click after a nap can take 10–20 seconds. That is normal for a demo.

---

## Step 3 — Invent secrets (do this before Vercel)

On your PC, in PowerShell:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run it **three times**. Save the results in a notepad you will not commit:

| Name | What to do |
|------|------------|
| `PAYLOAD_SECRET` | First random string |
| `REVALIDATION_SECRET` | Second random string |
| `SEED_SECRET` | Third random string |
| `ADMIN_USERNAME` | e.g. `brian` |
| `ADMIN_PASSWORD` | A strong password you have not used on the real site |
| `ADMIN_EMAIL` | Any email you control (can be fake-looking but must be unique in the DB) |

---

## Step 4 — Create the Vercel project

1. Open [vercel.com](https://vercel.com) and sign up with **GitHub**.
2. **Add New… → Project**.
3. Import your `milano` / `milano-demo` repo. Grant access if GitHub asks.
4. Settings to check:
   - **Framework Preset:** Next.js
   - **Root Directory:** leave empty (repo root)
   - **Node.js Version:** 20.x (Project Settings → General, if it is not already 20)
5. **Do not** click Deploy yet if you can add env vars on this screen. If Deploy is the only button, deploy once, then add env vars and **Redeploy**. Either order works.

### Environment variables

In the project: **Settings → Environment Variables**. Add each of these for **Production** (and Preview if you want branch URLs too).

| Variable | Value |
|----------|--------|
| `DATABASE_URI` | Neon **pooled** connection string |
| `PAYLOAD_SECRET` | From Step 3 |
| `REVALIDATION_SECRET` | From Step 3 |
| `SEED_SECRET` | From Step 3 |
| `ADMIN_USERNAME` | From Step 3 |
| `ADMIN_PASSWORD` | From Step 3 |
| `ADMIN_EMAIL` | From Step 3 |
| `NEXT_PUBLIC_SERVER_URL` | Full URL with `https://`, e.g. `https://milano-demo-xxxx.vercel.app` (no trailing slash) |
| `ABC_BOOKING_ENABLED` | `false` |
| `ABC_BOOKING_MAX_PER_DAY` | `1` |
| `SEED_ON_START` | `false` |
| `DEV_DASHBOARD_USER` | `dev` |
| `DEV_DASHBOARD_SECRET` | A long random string (same generator as Step 3) |
| `DEV_DASHBOARD_PATH` | Optional. Default `dev`. Example `n7k2m` makes the URL `/n7k2m` |

Leave `CLOUDINARY_*` empty unless you set up Cloudinary.

The metrics dashboard is **not** linked from the site. Open `https://YOUR-PROJECT.vercel.app/dev` (or your custom path). The browser will ask for HTTP Basic user/password. If `DEV_DASHBOARD_SECRET` is missing, that URL is 404.

**Important:** You may not know the `*.vercel.app` URL until the first deploy finishes. Then:

1. Copy the URL from the Vercel dashboard (HTTPS, no trailing slash).
2. Set `NEXT_PUBLIC_SERVER_URL` to that full `https://…` URL.
3. **Deployments → … on the latest → Redeploy** (so the public URL is baked into the build).

Never set `SEED_ON_START=true` on this public demo. That would let anyone hit `/api/bootstrap`.

---

## Step 5 — First deploy

1. Click **Deploy** (or push a commit to the connected branch).
2. Wait until the build is green. First build can take several minutes (`sharp`, Payload, Next).
3. Open the URL. You may see an empty-ish site or admin-only state until you seed. A 500 on the homepage before migrate/seed can happen; continue to Step 6.

If the build fails:

- Read the Vercel build log
- Confirm Node 20
- Confirm `PAYLOAD_SECRET` and `DATABASE_URI` are set
- Confirm you did not commit a broken `.env`

---

## Step 6 — Create tables, then seed content

The live app needs a schema in Neon, then sample pages/services.

In **PowerShell**, replace the URL and secret:

```powershell
$base = "https://YOUR-PROJECT.vercel.app"
$secret = "PASTE_SEED_SECRET_HERE"

Invoke-RestMethod -Method POST -Uri "$base/api/migrate" -Headers @{ "x-seed-secret" = $secret }
Invoke-RestMethod -Method POST -Uri "$base/api/seed" -Headers @{ "x-seed-secret" = $secret }
```

Or with `curl` (Git Bash / Windows curl):

```bash
curl -X POST "https://YOUR-PROJECT.vercel.app/api/migrate" -H "x-seed-secret: PASTE_SEED_SECRET_HERE"
curl -X POST "https://YOUR-PROJECT.vercel.app/api/seed" -H "x-seed-secret: PASTE_SEED_SECRET_HERE"
```

You want JSON back, not `Unauthorized`.

- **401** — `SEED_SECRET` in Vercel does not match what you sent. Fix the env var, redeploy if needed, retry.
- **500 / timeout** — Neon might still be waking, or seed ran long. Wait 30 seconds and run **seed** again. It should skip an admin user that already exists.
- Homepage still odd — hard refresh, then wait a minute (pages are cached ~60s).

Scraped photos are in git (`scripts/assets/scraped`, `media`, `public/scraped`), so seed **can** attach them if that commit was part of the Vercel build. New uploads in `/admin` on Vercel still will not last past the next deploy.

---

## Step 7 — Log in and turn on native booking

1. Open `https://YOUR-PROJECT.vercel.app/admin`
2. Log in with `ADMIN_USERNAME` and `ADMIN_PASSWORD`
3. **Change that password** in your account menu after first login
4. On the admin home screen:
   - Turn **Use Milano booking page** **ON**
   - Turn **Use native Milano booking UI** **ON**
5. Save if the screen asks you to
6. Open `/book` in a new tab (not logged in as a guest, or a private window)

You should see the Milano five-step flow. Confirm submit should stay **off** (`ABC_BOOKING_ENABLED=false`), so shareholders can walk the steps without creating a real ABC appointment. They will get a clear message if they try to send.

If you **must** show a real ABC write during the meeting:

- Set `ABC_BOOKING_ENABLED=true` in Vercel
- Redeploy
- Keep `ABC_BOOKING_MAX_PER_DAY=1`
- Tell the front desk, then **cancel the test visit in ABC**

Turn it back to `false` after the meeting.

---

## Step 8 — What to send shareholders

Send only the **public** URL:

```
https://YOUR-PROJECT.vercel.app
```

Suggested talking points:

- Book Now → `/book` (native wizard)
- Services, gallery, about
- This is a **staging copy**, not the live salon domain
- Admin is not for the group unless you are screensharing it

Optional: put a sticky note in the meeting chat that the first load after idle can be slow (Neon wake-up).

Do **not** send `SEED_SECRET`, Neon, or Vercel tokens.

---

## Step 9 — Before the meeting (checklist)

- [ ] Incognito window: homepage loads
- [ ] `/book` shows the native steps
- [ ] Phone-width view (step bar wraps 3 + 2, client picker, search)
- [ ] `/admin` login works with **your** password
- [ ] `ABC_BOOKING_ENABLED` is `false` unless you planned a live test
- [ ] Hit the site once 5 minutes before the call so Neon is awake
- [ ] You have the ABC salon booking URL as a fallback: see Hours & Contact → Advanced

---

## Step 10 — After the demo

**Leave it up** if they will click later. Free tiers stay up with sleep.

**Take it down** when you are done:

1. Vercel project → **Settings → General → Delete Project**
2. Neon → delete the `milano-demo` project
3. Rotate any password you reused (you should not have reused one)

Leaving a public `/admin` with a weak password is the main risk. Delete or change the password if the URL will sit around.

---

## Photos

Salon photos that are **in git** (`public/scraped`, `scripts/assets/scraped`, `media`, and `scripts/image-manifest.json`) go up with the Vercel build. Seed can attach them from those folders.

**Admin uploads on Vercel** still sit on an ephemeral disk. The next deploy wipes those new files unless you later add Cloudinary (or similar) as Payload storage.

Cloudinary remains optional. For a booking-only walkthrough you can skip it.

---

## Troubleshooting

| What you see | What to try |
|--------------|-------------|
| Build failed on Vercel | Open the build log; Node 20; `PAYLOAD_SECRET` set |
| `Unauthorized` on seed | `x-seed-secret` must equal Vercel `SEED_SECRET` |
| Homepage 500 | Run `/api/migrate` then `/api/seed`; check Neon is not paused |
| First click is very slow | Neon idle; wait and refresh once |
| `/book` is ABC in an iframe, not the wizard | Both booking toggles ON in admin; wait ~1 minute; hard refresh |
| “Native submit is disabled” | Expected while `ABC_BOOKING_ENABLED=false` |
| Admin login fails | Username (not email) + the password you set in Vercel **before** seed. If you seeded with defaults, try `admin` / `ChangeMe123!` then change it immediately |
| Env var changed but site did not | **Redeploy** after changing `NEXT_PUBLIC_*` variables |

Health check (no secret):

`https://YOUR-PROJECT.vercel.app/api/health`

Should return `"status":"ok"`.

---

## Cost and limits (honest)

- **Vercel Hobby:** free for this kind of demo. Bandwidth and build minutes are limited; a shareholder walkthrough is fine.
- **Neon free:** one small database; sleeps when idle.
- **GitHub:** free private repo is enough.
- **Custom `.com`:** not required. `vercel.app` is enough to present.

If Vercel asks you to add a credit card, you can still stay on Hobby. You do not need Pro for this demo.

---

## When you are ready for the real site

Use [DEPLOYMENT.md](DEPLOYMENT.md): production Neon project, real domain, Cloudflare, Cloudinary, and a different `PAYLOAD_SECRET`. Do not reuse this demo database for production.
