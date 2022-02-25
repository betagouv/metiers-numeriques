import { test, expect } from '@playwright/test'

import { TEST_CONTACTS } from './constants'

test.describe('Admin > Contacts', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('First Contact Creation', async ({ page }) => {
    const firstTestContact = TEST_CONTACTS[0]

    await page.goto('http://localhost:3000/admin')

    await page.click('"Contacts"')

    await expect(page.locator('h1')).toHaveText('Contacts')

    await page.click('"Ajouter un contact"')

    await expect(page.locator('h1')).toHaveText('Nouveau contact')

    await page.fill('"Nom *"', firstTestContact.name)
    await page.fill('"Email *"', firstTestContact.email)
    await page.fill('"Téléphone"', firstTestContact.phone)
    await page.fill('"Poste"', firstTestContact.position)
    await page.fill('"Notes"', firstTestContact.notes)
    await page.click('"Créer"')

    await expect(page.locator('h1')).toHaveText('Contacts')
    await expect(page.locator(`td:has-text("${firstTestContact.name}")`)).toBeVisible()
  })
})
