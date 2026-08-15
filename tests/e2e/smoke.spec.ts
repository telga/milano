import { expect, test } from '@playwright/test'

test.describe('Milano Nail Spa public site', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Luxury in Every Detail/i }).first(),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Book (Now|Appointment)/i }).first()).toBeVisible()
  })

  test('theme toggle persists preference', async ({ page }) => {
    await page.goto('/')
    const dialog = page.locator('[role="dialog"]')
    await dialog.waitFor({ state: 'visible', timeout: 5000 }).catch(() => null)
    if (await dialog.isVisible().catch(() => false)) {
      await dialog.click({ position: { x: 8, y: 8 } })
      await expect(dialog).toHaveCount(0)
    }

    const toggle = page.getByRole('button', { name: /Switch to (dark|light) mode/i })
    await expect(toggle).toHaveAttribute('data-theme-ready', 'true')

    const before = await page.locator('html').getAttribute('data-theme')
    await toggle.click()
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', before || '')

    const after = await page.locator('html').getAttribute('data-theme')
    expect(after).toBeTruthy()

    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', after!)
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

  test('website photo spots offer the standard placeholder', async ({ page }) => {
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
    await expect(page.getByText('Hero photos can be changed here too.', { exact: false })).toBeVisible()
  })
})
