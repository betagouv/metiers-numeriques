import { test, expect } from '@playwright/test'

import { TEST_LEGACY_SERVICES } from './constants'

test.describe('Admin > Legacy Services', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('First Legacy Service Creation', async ({ page }) => {
    const firstTestLegacyService = TEST_LEGACY_SERVICES[0]

    await page.goto('http://localhost:3000/admin')

    await page.click('"Services"')

    await expect(page.locator('h1')).toHaveText('Services [LEGACY]')

    await page.click('"Ajouter un service [LEGACY]"')

    await expect(page.locator('h1')).toHaveText('Nouveau service [LEGACY]')

    await page.fill('"Nom court *"', firstTestLegacyService.name)
    await page.fill('"Nom complet"', firstTestLegacyService.fullName)
    await page.fill('"Entité parente"', firstTestLegacyService.$entity)
    await page.click(`"${firstTestLegacyService.$entity}"`)
    await page.fill('"Région *"', firstTestLegacyService.region)
    await page.click(`"${firstTestLegacyService.region}"`)
    await page.fill('"Site Internet (URL)"', firstTestLegacyService.websiteUrl)
    await page.click('"Créer"')

    await expect(page.locator('h1')).toHaveText('Services [LEGACY]')
    await expect(page.locator(`td:has-text("${firstTestLegacyService.name}")`)).toBeVisible()
  })
})
