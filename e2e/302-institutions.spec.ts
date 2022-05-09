import { test, expect } from '@playwright/test'

import { TEST_INSTITUTIONS } from './constants'

test.describe('Admin > Institutions', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Institutions Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Institutions"')

    await expect(page.locator('h1')).toHaveText('Institutions')

    for (const testInstitution of TEST_INSTITUTIONS) {
      await page.click('"Ajouter une institution"')

      await expect(page.locator('h1')).toHaveText('Nouvelle institution')

      await page.fill('"Nom *"', testInstitution.name)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Institutions')
      await expect(page.locator(`td:has-text("${testInstitution.name}")`)).toBeVisible()
    }
  })
})
