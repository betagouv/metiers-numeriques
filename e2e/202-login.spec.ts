import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants.js'

test.describe('Admin > Authentication', () => {
  // TODO: there is currently no way to inform the user a given page is unauthorized.
  //  This PR could help us do it: https://github.com/nextauthjs/next-auth/pull/4788
  test.skip('Recruiting User Login Failure', async ({ page }) => {
    const testRecruitingUser = TEST_USERS[1]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h1')).toHaveText('Se connecter')

    await page.fill('"Email"', testRecruitingUser.email)
    await page.fill('"Mot de passe"', testRecruitingUser.password)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText('Page introuvable…')
  })

  test('Administration User Login', async ({ context, page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

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
