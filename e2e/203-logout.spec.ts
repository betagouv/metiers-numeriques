import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants.js'

test.describe('Admin > Authentication', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Administration User Logout', async ({ context, page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')

    await page.click('"Déconnexion"')

    await expect(page.locator('h1')).toHaveText('Se connecter')

    await page.fill('"Email"', testAdministrationUser.email)
    await page.fill('"Mot de passe"', testAdministrationUser.password)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')

    await context.storageState({
      path: './e2e/states/administrator.json',
    })
  })
})
