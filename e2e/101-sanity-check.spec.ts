import { test, expect } from '@playwright/test'

test.describe('Sanity Check', () => {
  test('API', async ({ request }) => {
    const resetResponse = await request.get('http://localhost:3000/api')

    expect(resetResponse.ok()).toBeTruthy()
  })

  test('Home', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.locator('h2 >> nth=0')).toHaveText(' Le site des métiers du numérique évolue !')
  })
})
