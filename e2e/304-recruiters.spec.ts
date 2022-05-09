import { test, expect } from '@playwright/test'

import { TEST_RECRUITERS } from './constants'

test.describe('Admin > Recruiters', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Recruiters Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Services recruteurs"')

    await expect(page.locator('h1')).toHaveText('Services recruteurs')

    for (const testRecruiter of TEST_RECRUITERS) {
      await page.click('"Ajouter un service recruteur"')

      await expect(page.locator('h1')).toHaveText('Nouveau service recruteur')

      await page.fill('"Nom *"', testRecruiter.displayName as string)
      await page.fill('"Institution *"', testRecruiter.institution.name)
      await page.click(`"${testRecruiter.institution.name}"`)
      await page.fill('"Site (URL)"', testRecruiter.websiteUrl as string)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Services recruteurs')
      await expect(page.locator(`td:has-text("${testRecruiter.displayName}")`)).toBeVisible()
    }
  })
})
