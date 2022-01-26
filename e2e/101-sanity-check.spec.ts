import { test, expect } from '@playwright/test'

test.describe('Sanity Check', () => {
  test('API', async ({ request }) => {
    const resetResponse = await request.get('http://localhost:3000/api')

    expect(resetResponse.ok()).toBeTruthy()
  })

  test('Home', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('h1')).toHaveText('L’État Numérique : Des projets à découvrir, des missions à pourvoir !')
  })
})
