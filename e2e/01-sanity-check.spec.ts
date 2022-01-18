import { test, expect } from '@playwright/test'

test.describe('Sanity Check', () => {
  test.beforeAll(async ({ request }) => {
    const resetResponse = await request.get('http://localhost:3000/api')
    expect(resetResponse.ok()).toBeTruthy()
  })

  test('Home', async ({ page }) => {
    await page.goto('http://localhost:3000')

    const pageTitle = await page.textContent('h1')
    expect(pageTitle).toBe('L’Etat Numérique : Des projets à découvrir, des missions à pourvoir !')
  })
})
