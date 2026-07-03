# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> Milano Nail Spa public site >> health endpoint
- Location: tests\e2e\smoke.spec.ts:26:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test'
  2  | 
  3  | test.describe('Milano Nail Spa public site', () => {
  4  |   test('homepage loads', async ({ page }) => {
  5  |     await page.goto('/')
  6  |     await expect(page.getByRole('heading', { name: /Milano Nail Spa/i }).first()).toBeVisible()
  7  |     await expect(page.getByRole('link', { name: /Book Now/i }).first()).toBeVisible()
  8  |   })
  9  | 
  10 |   test('services page renders categories', async ({ page }) => {
  11 |     await page.goto('/services')
  12 |     await expect(page.getByRole('heading', { name: 'Services', level: 1 })).toBeVisible()
  13 |   })
  14 | 
  15 |   test('blog post loads', async ({ page }) => {
  16 |     await page.goto('/blog/distinctive-features-of-milano-nail-spa-in-flower-mound')
  17 |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  18 |   })
  19 | 
  20 |   test('contact page has phone and map', async ({ page }) => {
  21 |     await page.goto('/contact')
  22 |     await expect(page.getByRole('main').getByText('214')).toBeVisible()
  23 |     await expect(page.locator('iframe[title*="map" i]')).toBeVisible()
  24 |   })
  25 | 
  26 |   test('health endpoint', async ({ request }) => {
  27 |     const res = await request.get('/api/health')
> 28 |     expect(res.ok()).toBeTruthy()
     |                      ^ Error: expect(received).toBeTruthy()
  29 |     const json = await res.json()
  30 |     expect(json.status).toBe('ok')
  31 |   })
  32 | })
  33 | 
  34 | test.describe('Admin', () => {
  35 |   test('admin login page loads', async ({ page }) => {
  36 |     await page.goto('/admin')
  37 |     await expect(page.locator('body')).toBeVisible()
  38 |   })
  39 | })
  40 | 
```