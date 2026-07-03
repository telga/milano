import { expect, test } from '@playwright/test'

test.describe('Milano Nail Spa public site', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Milano Nail Spa/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /Book Now/i }).first()).toBeVisible()
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
})
