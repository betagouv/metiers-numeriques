import { test, expect } from '@playwright/test'

import { TEST_PROFESSIONS } from './constants.js'

test.describe('Admin > Professions', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Professions Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Compétences"')

    await expect(page.locator('h1')).toHaveText('Compétences')

    for (const testProfession of TEST_PROFESSIONS) {
      await page.click('"Ajouter une compétence"')

      await expect(page.locator('h1')).toHaveText('Nouvelle compétence')

      await page.fill('"Nom *"', testProfession.name)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Compétences')
      await expect(page.locator(`td:has-text("${testProfession.name}")`)).toBeVisible()
    }
  })
})
