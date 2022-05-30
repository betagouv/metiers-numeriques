import { test, expect } from '@playwright/test'

import { TEST_JOBS, TEST_JOB_DRAFTS, TEST_USERS } from './constants.js'

test.describe('Admin > Recruiter Role', () => {
  test('Recruiter User Login', async ({ context, page }) => {
    const testRecruitingUser = TEST_USERS[1]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h4')).toHaveText('Connexion')

    await page.fill('"Email"', testRecruitingUser.email)
    await page.fill('"Mot de passe"', testRecruitingUser.password)
    await page.click('"Se connecter"')

    await expect(page.locator('h1')).toHaveText('Tableau de bord')

    await context.storageState({
      path: './e2e/states/recruiter.json',
    })
  })
})

test.describe('Admin > Recruiter Role', () => {
  test.use({
    storageState: './e2e/states/recruiter.json',
  })

  test('Recruiter User Jobs', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Offres d’emploi"')

    await expect(page.locator('h1')).toHaveText('Offres d’emploi')
    await expect(page.locator(`td:has-text("${TEST_JOB_DRAFTS[0].title}")`)).toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOB_DRAFTS[1].title}")`)).toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOB_DRAFTS[2].title}")`)).not.toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOB_DRAFTS[3].title}")`)).not.toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOBS[0].title}")`)).toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOBS[1].title}")`)).toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOBS[2].title}")`)).not.toBeVisible()
    await expect(page.locator(`td:has-text("${TEST_JOBS[3].title}")`)).not.toBeVisible()
  })
})
