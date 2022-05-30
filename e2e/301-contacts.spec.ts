import { test, expect } from '@playwright/test'

import { TEST_CONTACTS } from './constants.js'

test.describe('Admin > Contacts', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Contacts Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Contacts"')

    await expect(page.locator('h1')).toHaveText('Contacts')

    for (const testContact of TEST_CONTACTS) {
      await page.click('"Ajouter un contact"')

      await expect(page.locator('h1')).toHaveText('Nouveau contact')

      await page.fill('"Nom *"', testContact.name)
      await page.fill('"Email *"', testContact.email)
      await page.fill('"Téléphone"', testContact.phone as string)
      await page.fill('"Poste"', testContact.position as string)
      await page.fill('"Notes"', testContact.note as string)
      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Contacts')
      await expect(page.locator(`td:has-text("${testContact.name}")`)).toBeVisible()
    }
  })
})
