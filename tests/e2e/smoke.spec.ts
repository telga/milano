import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

async function revalidateSiteContent(request: APIRequestContext) {
  const secret = process.env.REVALIDATION_SECRET
  if (!secret) return
  await request.post('/api/revalidate', {
    headers: {
      'Content-Type': 'application/json',
      'x-revalidation-secret': secret,
    },
    data: { tags: ['site-content'] },
  })
}

async function loginAsAdmin(page: Page) {
  const username =
    process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin@milanonailflowermound.com'
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

  await page.goto('/admin/login')
  await page
    .locator('#field-username, input[name="username"], #field-email, input[name="email"]')
    .first()
    .fill(username)
  await page.locator('#field-password, input[name="password"]').first().fill(password)
  await page.getByRole('button', { name: /^Login$/i }).click()
  await page.waitForURL(/\/admin(\/)?$/, { timeout: 20000 })
}

async function setCustomBookingEnabled(page: Page, enabled: boolean) {
  await setBookingSettings(page, { useCustomBookingFrontend: enabled, useNativeAbcBooking: false })
}

async function setBookingSettings(
  page: Page,
  settings: { useCustomBookingFrontend?: boolean; useNativeAbcBooking?: boolean },
) {
  const status = await page.evaluate(async (value) => {
    const res = await fetch('/api/globals/site-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(value),
    })
    return res.status
  }, settings)
  expect(status).toBe(200)
  await revalidateSiteContent(page.request)
}

function headerBookLink(page: Page) {
  return page.locator('header').getByRole('link', { name: 'Book Now' })
}

test.describe('Milano Nail Spa public site', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Luxury in Every Detail/i }).first(),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Book (Now|Appointment)/i }).first()).toBeVisible()
  })

  test('theme follows the device default', async ({ page }) => {
    await page.goto('/')
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null)
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.click({ position: { x: 8, y: 8 } })
      await expect(dialog).toHaveCount(0)
    }

    const deviceTheme = await page.evaluate(() =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    )
    await expect(page.locator('html')).toHaveAttribute('data-theme', deviceTheme)

    const toggle = page.getByRole('button', { name: /Switch to (dark|light) mode/i })
    await expect(toggle).toHaveAttribute('data-theme-ready', 'true')

    await toggle.click()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', deviceTheme)

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', deviceTheme)
  })

  test('services page renders categories', async ({ page }) => {
    await page.goto('/services')
    await expect(page.getByRole('heading', { name: 'Services', level: 1 })).toBeVisible()
  })

  test('blog post loads', async ({ page }) => {
    await page.goto('/blog/distinctive-features-of-milano-nail-spa-in-flower-mound')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('contact page has phone and map', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('main').getByText('214')).toBeVisible()
    await expect(page.locator('iframe[title*="map" i]')).toBeVisible()
  })

  test('navigation links remain available', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const mainNav = page.getByRole('navigation', { name: 'Main' })
    await expect(mainNav.getByRole('link', { name: 'About Us' })).toBeVisible()
    await expect(mainNav.getByRole('link', { name: 'Services' })).toBeVisible()
    await expect(mainNav.getByRole('link', { name: 'Contact' })).toBeVisible()
    await expect(mainNav.getByRole('link', { name: 'Visit Us' })).toHaveCount(0)
  })

  test('visit-us redirects to about with experience and social links', async ({ page }) => {
    await page.goto('/visit-us')
    await expect(page).toHaveURL(/\/about\/?$/)
    await expect(page.getByRole('heading', { name: /Where Passion Meets/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /The Salon/i })).toBeVisible()
    await expect(page.getByText(/Spacious Sanctuary/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /Google Maps/i })).toBeVisible()
  })

  test('health endpoint', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.ok()).toBeTruthy()
    const json = await res.json()
    expect(json.status).toBe('ok')
  })

  test('dev dashboard is locked', async ({ request }) => {
    const res = await request.get('/dev')
    expect([401, 404]).toContain(res.status())

    const secret = process.env.DEV_DASHBOARD_SECRET
    if (secret) {
      const user = process.env.DEV_DASHBOARD_USER || 'dev'
      const authed = await request.get('/dev', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${user}:${secret}`).toString('base64')}`,
        },
      })
      expect(authed.ok()).toBeTruthy()
    }
  })
})

test.describe('Booking facade', () => {
  test.describe.configure({ mode: 'serial' })

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage()
    try {
      await loginAsAdmin(page)
      await setBookingSettings(page, {
        useCustomBookingFrontend: false,
        useNativeAbcBooking: false,
      })
    } finally {
      await page.close()
    }
  })

  test('book link uses ABC when custom booking is off', async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const bookLink = headerBookLink(page)
    await expect(bookLink).toBeVisible()
    await expect(bookLink).toHaveAttribute('href', /abcapp\.us/)
    await expect(bookLink).toHaveAttribute('target', '_blank')
  })

  test('/book redirects to ABC when custom booking is off', async ({ page }) => {
    await page.goto('/book')
    await expect(page).toHaveURL(/abcapp\.us/)
  })

  test('custom booking ON routes to /book with iframe shell', async ({ page }) => {
    test.slow()
    await loginAsAdmin(page)
    await setCustomBookingEnabled(page, true)

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    const bookLink = headerBookLink(page)
    await expect(bookLink).toHaveAttribute('href', '/book')
    await expect(bookLink).not.toHaveAttribute('target', '_blank')

    await page.goto('/book')
    await expect(page.getByRole('heading', { name: /Reserve Your/i })).toBeVisible()
    await expect(page.locator('iframe[title*="Book an appointment" i]')).toBeVisible()

    await setCustomBookingEnabled(page, false)
  })

  test('native wizard renders service step with mocked API', async ({ page }) => {
    test.slow()

    await page.route('**/api/booking/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'test-session',
          staff: [{ id: 'van', name: 'Van' }],
        }),
      })
    })

    await page.route('**/api/booking/services', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          categories: ['Manicure'],
          services: [
            {
              id: 'manicure::delux mani::5',
              name: 'Delux Mani',
              category: 'Manicure',
              price: 31,
              durationMinutes: 20,
            },
          ],
        }),
      })
    })

    await loginAsAdmin(page)
    await setBookingSettings(page, {
      useCustomBookingFrontend: true,
      useNativeAbcBooking: true,
    })

    await page.goto('/book')
    await expect(page.getByRole('heading', { name: /Your Perfect Nails/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Choose Your Service/i })).toBeVisible()
    await expect(page.getByText('Number of clients')).toBeVisible()
    await expect(page.getByRole('button', { name: /Number of clients, currently 1/i })).toBeVisible()
    await expect(page.getByLabel('Search services')).toBeVisible()
    await page.getByRole('button', { name: /Manicure/i }).click()
    await expect(page.getByRole('button', { name: 'Delux Mani' })).toBeVisible()

    await setBookingSettings(page, {
      useCustomBookingFrontend: false,
      useNativeAbcBooking: false,
    })
  })
})

test.describe('Admin', () => {
  test('admin login page loads', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.locator('body')).toBeVisible()
  })

  test('admin dashboard shows guided tasks after login', async ({ page }) => {
    const username =
      process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin@milanonailflowermound.com'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    await page.goto('/admin/login')
    await page
      .locator('#field-username, input[name="username"], #field-email, input[name="email"]')
      .first()
      .fill(username)
    await page.locator('#field-password, input[name="password"]').first().fill(password)
    await page.getByRole('button', { name: /^Login$/i }).click()

    await expect(page.getByRole('heading', { name: /What would you like to update/i })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.getByRole('link', { name: /Change opening hours or phone/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Add or edit a service/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Swap a photo on the website/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /View live website/i }).first()).toBeVisible()

    await expect(page.getByRole('switch', { name: /Use Milano booking page/i })).toBeVisible()

    // Shortcuts pinned above the sidebar nav
    await expect(page.getByRole('link', { name: /Hours & contact/i }).first()).toBeVisible()
  })

  test('service list reads in plain language', async ({ page }) => {
    // Admin routes can exceed the default budget on a cold dev-server compile.
    test.slow()
    const username =
      process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin@milanonailflowermound.com'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    await page.goto('/admin/login')
    await page
      .locator('#field-username, input[name="username"], #field-email, input[name="email"]')
      .first()
      .fill(username)
    await page.locator('#field-password, input[name="password"]').first().fill(password)
    await page.getByRole('button', { name: /^Login$/i }).click()
    await page.waitForURL(/\/admin(\/)?$/, { timeout: 20000 })

    await page.goto('/admin/collections/services')
    await expect(page.locator('.milano-pill').first()).toBeVisible({ timeout: 20000 })
    await expect(page.getByText('<No Duration', { exact: false })).toHaveCount(0)
  })

  test('admin offers website display controls', async ({ page }) => {
    test.slow()
    const username =
      process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin@milanonailflowermound.com'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

    await page.goto('/admin/login')
    await page
      .locator('#field-username, input[name="username"], #field-email, input[name="email"]')
      .first()
      .fill(username)
    await page.locator('#field-password, input[name="password"]').first().fill(password)
    await page.getByRole('button', { name: /^Login$/i }).click()
    await page.waitForURL(/\/admin(\/)?$/, { timeout: 20000 })

    await page.goto('/admin/collections/site-image-slots')
    await page.getByText('Home — Hero', { exact: true }).first().click()
    await expect(
      page.getByText('Use grey crosshatch placeholder', { exact: true }).first(),
    ).toBeVisible()
    await expect(page.getByText('Photo (light mode / default)', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Photo (dark mode)', { exact: true }).first()).toBeVisible()

    await page.goto('/admin/globals/site-settings')
    await page.getByRole('button', { name: 'Navigation' }).click()
    await expect(page.getByText('Hide pages from website menus', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Service cards' }).click()
    await expect(page.getByText('Hide icons on service cards', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Booking' }).click()
    await expect(page.getByText('Use Milano booking page', { exact: true })).toBeVisible()
    await expect(page.getByText('Use native Milano booking UI', { exact: true })).toBeVisible()
  })
})
