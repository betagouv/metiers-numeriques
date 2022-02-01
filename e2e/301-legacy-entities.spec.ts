import { test, expect } from '@playwright/test'

import { TEST_LEGACY_ENTITIES } from './constants'

test.describe('Admin > Legacy Entities', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('First Legacy Entity Creation', async ({ page }) => {
    const firstTestLegacyEntity = TEST_LEGACY_ENTITIES[0]

    await page.goto('http://localhost:3000/admin')

    await page.click('"Entités"')

    await expect(page.locator('h1')).toHaveText('Entités [LEGACY]')

    await page.click('"Ajouter une entité [LEGACY]"')

    await expect(page.locator('h1')).toHaveText('Nouvelle entité [LEGACY]')

    await page.fill('"Nom court *"', firstTestLegacyEntity.name)
    await page.fill('"Nom complet"', firstTestLegacyEntity.fullName)
    await page.fill('"Logo (URL)"', firstTestLegacyEntity.logoUrl)
    await page.click('"Créer"')

    await expect(page.locator('h1')).toHaveText('Entités [LEGACY]')
    await expect(page.locator(`td:has-text("${firstTestLegacyEntity.name}")`)).toBeVisible()
  })
})
