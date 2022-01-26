import { test, expect } from '@playwright/test'

import { FIRST_USER } from './constants'

test.describe('Login', () => {
  test('First User Login', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')

    await page.fill('[name="logInEmail"]', FIRST_USER.email)
    await page.fill('[name="logInPassword"]', FIRST_USER.password)
    await page.click('text=Se connecter')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')
  })
})
