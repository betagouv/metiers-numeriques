import { test, expect } from '@playwright/test'

import { TEST_DOMAINS } from './constants.js'

test.describe('Admin > Domains', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Domains Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Domaines"')

    await expect(page.locator('h1')).toHaveText('Domaines')

    for (const testDomain of TEST_DOMAINS) {
      await page.click('"Ajouter un domaine"')

      await expect(page.locator('h1')).toHaveText('Nouveau domaine')

      await page.fill('"Nom *"', testDomain.name)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Domaines')
      await expect(page.locator(`td:has-text("${testDomain.name}")`)).toBeVisible()
    }
  })
})
