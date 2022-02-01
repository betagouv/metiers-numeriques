import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants'

test.describe('Login', () => {
  test('First User Login', async ({ context, page }) => {
    const firstTestUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

    await page.fill('"Email"', firstTestUser.email)
    await page.fill('"Mot de passe"', firstTestUser.password)
    await page.click('"Se connecter"')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')

    await context.storageState({
      path: './e2e/states/administrator.json',
    })
  })
})
