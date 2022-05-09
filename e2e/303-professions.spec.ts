import { test, expect } from '@playwright/test'

import { TEST_PROFESSIONS } from './constants'

test.describe('Admin > Professions', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Professions Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Secteurs d’activité"')

    await expect(page.locator('h1')).toHaveText('Secteurs d’activité')

    for (const testProfession of TEST_PROFESSIONS) {
      await page.click('"Ajouter un secteur d’activité"')

      await expect(page.locator('h1')).toHaveText('Nouveau secteur d’activité')

      await page.fill('"Nom *"', testProfession.name)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Secteurs d’activité')
      await expect(page.locator(`td:has-text("${testProfession.name}")`)).toBeVisible()
    }
  })
})
