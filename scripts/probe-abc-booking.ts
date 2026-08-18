/**
 * Dev-only multi-step probe for ABC Salon POS appointment flow.
 * Navigates through booking steps but NEVER clicks final Submit/Confirm.
 *
 * Usage: npm run probe:abc-booking
 * Output: docs/ABC_BOOKING_PROBE.md + docs/ABC_BOOKING_PROTOCOL.md
 */

import { writeFileSync } from 'fs'
import { chromium, type Page, type Request, type Response } from 'playwright'

const ABC_URL =
  process.env.ABC_BOOKING_URL ||
  'https://abcapp.us/feedback/appointment?appid=tI8PdCO'

const FAKE_PHONE = '5555550100'
const FAKE_NAME = 'Probe Test User'

type PostCapture = {
  step: string
  method: string
  url: string
  postData: string | null
  status: number
  contentType: string
  responsePreview: string
}

type StepResult = {
  step: string
  success: boolean
  note: string
  visibleText?: string
}

type ServiceItem = {
  id: string
  name: string
  category: string
  price?: string
  duration?: string
}

function truncate(text: string, max = 1200): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

async function capturePosts(page: Page, step: string, posts: PostCapture[]): Promise<void> {
  const handler = async (request: Request) => {
    if (request.method() !== 'POST') return
    const url = request.url()
    if (!url.includes('abcapp.us')) return

    let response: Response | null = null
    try {
      response = await request.response()
    } catch {
      /* response may be unavailable */
    }

    let responsePreview = ''
    let status = 0
    let contentType = ''
    if (response) {
      status = response.status()
      contentType = response.headers()['content-type'] || ''
      try {
        const body = await response.text()
        responsePreview = truncate(body, 800)
      } catch {
        responsePreview = '(could not read body)'
      }
    }

    posts.push({
      step,
      method: request.method(),
      url,
      postData: request.postData() || null,
      status,
      contentType,
      responsePreview,
    })
  }

  page.on('requestfinished', handler)
  await page.waitForTimeout(1500)
  page.off('requestfinished', handler)
}

async function extractServices(page: Page): Promise<ServiceItem[]> {
  return page.evaluate(() => {
    const items: ServiceItem[] = []

    // ABC renders category sections with expandable service lists
    const categoryBlocks = document.querySelectorAll('[class*="category"], .service-category, section')
    const seen = new Set<string>()

    // Try common patterns: data attributes, onclick handlers, list items
    document.querySelectorAll('[data-service-id], [data-id], input[type="checkbox"], input[type="radio"]').forEach((el) => {
      const id =
        el.getAttribute('data-service-id') ||
        el.getAttribute('data-id') ||
        (el as HTMLInputElement).value ||
        ''
      const name =
        el.getAttribute('data-name') ||
        el.closest('label')?.textContent?.trim() ||
        el.parentElement?.textContent?.trim() ||
        ''
      if (id && name && !seen.has(id)) {
        seen.add(id)
        items.push({ id, name: truncate(name, 80), category: 'unknown' })
      }
    })

    // Parse visible service rows from text structure
    document.querySelectorAll('li, tr, .service-item, [class*="service"]').forEach((el) => {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
      if (text.length < 3 || text.length > 200) return
      const input = el.querySelector('input')
      const id = input?.value || input?.id || el.id || ''
      if (!id || seen.has(id)) return
      const priceMatch = text.match(/\$[\d.]+(?:\+)?/)
      const durationMatch = text.match(/\d+\s*min/i)
      seen.add(id)
      items.push({
        id,
        name: text.slice(0, 80),
        category: 'unknown',
        price: priceMatch?.[0],
        duration: durationMatch?.[0],
      })
    })

    return items

    function truncate(s: string, max: number) {
      return s.length > max ? `${s.slice(0, max)}…` : s
    }
  })
}

async function extractHiddenFields(page: Page): Promise<Record<string, string>> {
  return page.evaluate(() => {
    const fields: Record<string, string> = {}
    document.querySelectorAll('input[type="hidden"]').forEach((el) => {
      const name = (el as HTMLInputElement).name
      if (name) fields[name] = (el as HTMLInputElement).value
    })
    return fields
  })
}

async function clickFirstMatching(page: Page, patterns: RegExp[]): Promise<boolean> {
  for (const pattern of patterns) {
    const btn = page.getByRole('button', { name: pattern }).first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      return true
    }
    const link = page.getByRole('link', { name: pattern }).first()
    if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
      await link.click()
      return true
    }
  }
  return false
}

async function trySelectService(page: Page): Promise<StepResult> {
  // Expand first category (Manicure or similar)
  const categoryPatterns = [/manicure/i, /pedicure/i, /\d+\s*services/i]
  for (const pattern of categoryPatterns) {
    const cat = page.locator('text=' + pattern.source.replace(/\\i?$/, '')).first()
    if (await cat.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cat.click()
      await page.waitForTimeout(800)
      break
    }
  }

  // Click first checkbox or service row
  const checkbox = page.locator('input[type="checkbox"]').first()
  if (await checkbox.isVisible({ timeout: 3000 }).catch(() => false)) {
    await checkbox.check()
    return { step: 'select_service', success: true, note: 'Checked first service checkbox' }
  }

  const radio = page.locator('input[type="radio"]').first()
  if (await radio.isVisible({ timeout: 2000 }).catch(() => false)) {
    await radio.check()
    return { step: 'select_service', success: true, note: 'Selected first service radio' }
  }

  // Try clicking a service name row
  const serviceRow = page.locator('li, tr').filter({ hasText: /\$/ }).first()
  if (await serviceRow.isVisible({ timeout: 2000 }).catch(() => false)) {
    await serviceRow.click()
    return { step: 'select_service', success: true, note: 'Clicked first priced service row' }
  }

  return { step: 'select_service', success: false, note: 'Could not find selectable service element' }
}

async function tryAdvance(page: Page): Promise<boolean> {
  const advancePatterns = [
    /^continue$/i,
    /^next$/i,
    /^proceed$/i,
    /continue to/i,
    /next step/i,
    /review/i,
  ]
  return clickFirstMatching(page, advancePatterns)
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  const posts: PostCapture[] = []
  const steps: StepResult[] = []
  let services: ServiceItem[] = []
  let hiddenFields: Record<string, string> = {}
  let cookies: string[] = []
  let goNoGo: 'GO' | 'NO-GO' = 'NO-GO'
  let goNoGoReason = ''

  page.on('requestfinished', async (request) => {
    if (request.method() !== 'POST' || !request.url().includes('abcapp.us')) return
    let response: Response | null = null
    try {
      response = await request.response()
    } catch {
      return
    }
    let responsePreview = ''
    let status = 0
    let contentType = ''
    if (response) {
      status = response.status()
      contentType = response.headers()['content-type'] || ''
      try {
        responsePreview = truncate(await response.text(), 800)
      } catch {
        responsePreview = '(unreadable)'
      }
    }
    posts.push({
      step: 'auto',
      method: request.method(),
      url: request.url(),
      postData: request.postData() || null,
      status,
      contentType,
      responsePreview,
    })
  })

  // --- Step: Load ---
  const response = await page.goto(ABC_URL, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(2000)

  const headers = response?.headers() || {}
  cookies = (await context.cookies()).map((c) => `${c.name}=${c.value.slice(0, 20)}…`)
  hiddenFields = await extractHiddenFields(page)
  services = await extractServices(page)
  steps.push({
    step: 'load',
    success: true,
    note: `Loaded page. Found ${services.length} potential service elements.`,
    visibleText: truncate(await page.evaluate(() => document.body.innerText)),
  })

  // --- Step: Select service ---
  const serviceResult = await trySelectService(page)
  steps.push(serviceResult)
  await page.waitForTimeout(1500)

  // Try to advance after service selection
  const advancedAfterService = await tryAdvance(page)
  steps.push({
    step: 'advance_after_service',
    success: advancedAfterService,
    note: advancedAfterService ? 'Clicked continue/next' : 'No continue button found',
  })
  await page.waitForTimeout(2000)

  // --- Step: Guest count ---
  const guestSelect = page.locator('select, input[type="number"]').first()
  if (await guestSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    const tag = await guestSelect.evaluate((el) => el.tagName.toLowerCase())
    if (tag === 'select') {
      await guestSelect.selectOption({ index: 1 }).catch(() => {})
    } else {
      await guestSelect.fill('1').catch(() => {})
    }
    steps.push({ step: 'guest_count', success: true, note: 'Set guest count to 1' })
  } else {
    steps.push({ step: 'guest_count', success: false, note: 'Guest count control not found' })
  }
  await tryAdvance(page)
  await page.waitForTimeout(2000)

  // --- Step: Review / date ---
  steps.push({
    step: 'review_or_date',
    success: true,
    note: truncate(await page.evaluate(() => document.body.innerText), 200),
  })
  await tryAdvance(page)
  await page.waitForTimeout(2000)

  // --- Step: Date/time ---
  const dateInput = page.locator('input[type="date"], input[type="text"][placeholder*="date" i]').first()
  if (await dateInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await dateInput.fill('2026-09-01').catch(() => {})
    steps.push({ step: 'date_pick', success: true, note: 'Filled date field' })
  } else {
    // Try clicking a calendar day or time slot
    const timeSlot = page.getByText(/morning|afternoon|evening|\d{1,2}:\d{2}/i).first()
    if (await timeSlot.isVisible({ timeout: 2000 }).catch(() => false)) {
      await timeSlot.click()
      steps.push({ step: 'date_pick', success: true, note: 'Clicked time slot text' })
    } else {
      steps.push({ step: 'date_pick', success: false, note: 'Date/time controls not found' })
    }
  }
  await tryAdvance(page)
  await page.waitForTimeout(2000)

  // --- Step: Staff ---
  const staffOption = page.getByText(/any available|first available|no preference/i).first()
  if (await staffOption.isVisible({ timeout: 3000 }).catch(() => false)) {
    await staffOption.click()
    steps.push({ step: 'staff_pick', success: true, note: 'Selected any available staff' })
  } else {
    const staffRow = page.locator('input[type="radio"]').first()
    if (await staffRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await staffRow.check()
      steps.push({ step: 'staff_pick', success: true, note: 'Selected first staff radio' })
    } else {
      steps.push({ step: 'staff_pick', success: false, note: 'Staff selection not found' })
    }
  }
  await tryAdvance(page)
  await page.waitForTimeout(2000)

  // --- Step: Customer details (fake data) ---
  const phoneInput = page.locator('input[type="tel"], input[name*="phone" i], input[placeholder*="phone" i]').first()
  const nameInput = page.locator('input[name*="name" i], input[placeholder*="name" i]').first()

  let detailsFilled = false
  if (await phoneInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await phoneInput.fill(FAKE_PHONE)
    detailsFilled = true
  }
  if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
    await nameInput.fill(FAKE_NAME)
    detailsFilled = true
  }
  steps.push({
    step: 'customer_details',
    success: detailsFilled,
    note: detailsFilled ? `Filled fake phone ${FAKE_PHONE} and name` : 'Customer detail fields not found',
  })

  // STOP before submit — capture verify screen
  hiddenFields = await extractHiddenFields(page)
  const verifyText = truncate(await page.evaluate(() => document.body.innerText))
  steps.push({
    step: 'verify_screen',
    success: true,
    note: 'Stopped before submit. Verify screen excerpt below.',
    visibleText: verifyText,
  })

  await browser.close()

  // --- Go/no-go analysis ---
  const hasPosts = posts.length > 0
  const hasParseablePostData = posts.some((p) => p.postData && p.postData.length > 10)
  const hasHtmlResponses = posts.some((p) => p.contentType.includes('html'))
  const hasJsonResponses = posts.some((p) => p.contentType.includes('json'))
  const servicesFound = services.length > 0
  const stepsAdvanced = steps.filter((s) => s.success && s.step !== 'load').length >= 2

  if (hasPosts && hasParseablePostData && (hasHtmlResponses || hasJsonResponses) && stepsAdvanced) {
    goNoGo = 'GO'
    goNoGoReason =
      'ABC uses repeatable POST requests with parseable bodies and HTML/JSON responses. Server-side proxy is feasible with HTML parsing.'
  } else if (hasPosts && hasParseablePostData) {
    goNoGo = 'GO'
    goNoGoReason =
      'POST chain detected with body data. Proxy feasible but response parsing needs validation against live HTML.'
  } else {
    goNoGo = 'NO-GO'
    goNoGoReason =
      'Insufficient parseable protocol data. Fallback to iframe facade. Re-run probe or inspect ABC UI manually.'
  }

  const xFrame = headers['x-frame-options'] || headers['X-Frame-Options'] || '(none)'
  const csp = headers['content-security-policy'] || headers['Content-Security-Policy'] || '(none)'

  const probeMd = `# ABC Booking Probe

Generated by \`scripts/probe-abc-booking.ts\`. **Do not run submit actions against production.**

## Target

\`${ABC_URL}\`

## Response headers (embedding)

| Header | Value |
|--------|-------|
| X-Frame-Options | ${xFrame} |
| Content-Security-Policy | ${truncate(csp, 500)} |

## Step navigation results

${steps.map((s) => `- **${s.step}**: ${s.success ? 'OK' : 'FAIL'} — ${s.note}${s.visibleText ? `\n  > ${s.visibleText.slice(0, 300)}` : ''}`).join('\n')}

## Service catalog (extracted)

Found **${services.length}** potential service elements.

\`\`\`json
${JSON.stringify(services.slice(0, 40), null, 2)}
\`\`\`

## Hidden fields (last screen)

\`\`\`json
${JSON.stringify(hiddenFields, null, 2)}
\`\`\`

## POST captures (${posts.length})

${posts.length ? posts.map((p, i) => `### POST ${i + 1} (${p.step})

- **URL:** \`${p.url}\`
- **Status:** ${p.status}
- **Content-Type:** ${p.contentType || '(none)'}
- **Body:**
\`\`\`
${p.postData || '(empty)'}
\`\`\`
- **Response preview:**
\`\`\`
${p.responsePreview}
\`\`\`
`).join('\n') : '_No POST requests captured._'}

## Cookies observed

${cookies.length ? cookies.map((c) => `- \`${c}\``).join('\n') : '_None_'}
`

  const protocolMd = `# ABC Booking Protocol

Generated by \`scripts/probe-abc-booking.ts\`. **Dev-only — never auto-submit in production.**

## Go / No-Go Verdict

| Verdict | **${goNoGo}** |
|---------|---------------|
| Reason | ${goNoGoReason} |

${goNoGo === 'GO' ? `### Recommended architecture

1. **Server-side session** — Next.js maintains ABC cookies in \`src/lib/abc-booking/session.ts\`
2. **HTML POST chain** — Each step POSTs to \`${ABC_URL.split('?')[0]}\` with form-encoded or multipart body
3. **Response parsing** — Cheerio/HTML parser extracts next-step fields, service catalog, availability slots
4. **Client proxy** — Browser calls \`/api/booking/*\`; never talks to abcapp.us directly
5. **Submit gate** — \`ABC_BOOKING_ENABLED=true\` required for final submit in production

### POST endpoint

All steps appear to POST to:

\`\`\`
POST https://abcapp.us/feedback/appointment?appid=tI8PdCO
\`\`\`

Content types observed: ${[...new Set(posts.map((p) => p.contentType || 'unknown'))].join(', ') || 'unknown'}

### Session requirements

- Cookies from initial GET must be forwarded on every POST
- Hidden fields from each response must be included in the next request
- ${Object.keys(hiddenFields).length} hidden fields on verify screen: \`${Object.keys(hiddenFields).join(', ') || 'none detected'}\`

### Service catalog

- ${services.length} service elements extracted from DOM
- Map to CMS via \`abcServiceId\` field or fuzzy name match
- ABC is source of truth for availability/pricing at booking time

### Staff & availability

- Staff selection: radio buttons or "any available" text match
- Date/time: text slots (Morning/Afternoon/Evening) or date inputs
- Parsing logic in \`src/lib/abc-booking/availability.ts\`

### Safety

- Probe uses fake phone **${FAKE_PHONE}** and name **${FAKE_NAME}**
- Never click Submit/Confirm in probe
- Store must approve before enabling \`ABC_BOOKING_ENABLED\`
` : `### Fallback

Keep existing iframe facade at \`/book\`. Native proxy is not recommended until protocol is re-probed with manual step capture.

See [ABC_BOOKING_PROBE.md](ABC_BOOKING_PROBE.md) for raw capture data.
`}

## Step-by-step capture log

${steps.map((s) => `| ${s.step} | ${s.success ? 'Pass' : 'Fail'} | ${s.note.replace(/\|/g, '/')} |`).join('\n')}

## POST request log

| # | Step | Status | Content-Type | Body length |
|---|------|--------|--------------|-------------|
${posts.map((p, i) => `| ${i + 1} | ${p.step} | ${p.status} | ${p.contentType || '-'} | ${p.postData?.length ?? 0} |`).join('\n') || '| — | — | — | — | — |'}

## Rollout checklist (store)

- [ ] Review go/no-go verdict with developer
- [ ] If GO: enable \`useNativeAbcBooking\` only after test appointment with staff present
- [ ] Confirm SMS confirmation matches direct ABC booking
- [ ] Set \`ABC_BOOKING_ENABLED=true\` only in production when ready
- [ ] Monitor monthly for ABC UI changes; re-run \`npm run probe:abc-booking\`
`

  writeFileSync('docs/ABC_BOOKING_PROBE.md', probeMd, 'utf8')
  writeFileSync('docs/ABC_BOOKING_PROTOCOL.md', protocolMd, 'utf8')

  console.log('Wrote docs/ABC_BOOKING_PROBE.md')
  console.log('Wrote docs/ABC_BOOKING_PROTOCOL.md')
  console.log(`Verdict: ${goNoGo} — ${goNoGoReason}`)
  console.log(`POST captures: ${posts.length}, services: ${services.length}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
