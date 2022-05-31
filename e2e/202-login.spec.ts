import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants.js'

test.describe('Admin > Authentication', () => {
  test('Recruiting User Login Failure', async ({ page }) => {
    const testRecruitingUser = TEST_USERS[1]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h4')).toHaveText('Connexion')

    await page.fill('"Email"', testRecruitingUser.email)
    await page.fill('"Mot de passe"', testRecruitingUser.password)
    await page.click('"Se connecter"')

    await expect(page.locator('.Error')).toHaveText('Votre compte n’a pas encore été activé.')
  })

  test('Administration User Login', async ({ context, page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h4')).toHaveText('Connexion')

    await page.fill('"Email"', testAdministrationUser.email)
    await page.fill('"Mot de passe"', testAdministrationUser.password)
    await page.click('"Se connecter"')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')

    await context.storageState({
      path: './e2e/states/administrator.json',
    })
  })
})
