import { test, expect } from '@playwright/test'

import { TEST_USERS } from './constants'

test.describe('Admin > Users', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Recruiter User Account Linking & Activation', async ({ page }) => {
    const testRecruitingUser = TEST_USERS[1]

    await page.goto('http://localhost:3000/admin')
    await page.click('"Utilisateur·rices"')

    await expect(page.locator('h1')).toHaveText('Utilisateur·rices')

    await page.click(
      `td[aria-label="Éditer cet·te utilisateur·rice"]:right-of(:text("${testRecruitingUser.firstName}"))`,
    )

    await expect(page.locator('h1')).toHaveText('Édition d’un·e utilisateur·rice')

    await page.fill('"Service recruteur"', (testRecruitingUser.recruiter as any).displayName)
    await page.click(`"${(testRecruitingUser.recruiter as any).displayName}"`)
    await page.check('"Compte actif"')

    await page.click('"Mettre à jour"')

    await expect(page.locator('h1')).toHaveText('Utilisateur·rices')
  })
})
