import { test, expect } from '@playwright/test'

test.describe('Client > Jobs Filters', () => {
  test.slow()

  test('Remote Filter', async ({ browser, page }) => {
    const browserContext = await browser.newContext()
    await browserContext.addInitScript({
      path: './scripts/dev/seed.js',
    })

    await page.goto('http://localhost:3000')

    await page.click('"Télétravail"')
    await page.click('"Total"')

    await expect(page.locator('.job-card', { hasText: 'Job B1a Mission' })).toBeVisible()
  })
})
