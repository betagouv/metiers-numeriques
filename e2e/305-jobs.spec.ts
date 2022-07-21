import { test, expect } from '@playwright/test'

import { TEST_JOBS, TEST_JOB_DRAFTS } from './constants.js'

test.describe('Admin > Jobs', () => {
  test.slow()
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Jobs Drafting', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Offres d’emploi"')

    await expect(page.locator('h1')).toHaveText('Offres d’emploi')

    for (const testJobDraft of TEST_JOB_DRAFTS) {
      await test.step(testJobDraft.title, async () => {
        await page.click('"Ajouter une offre d’emploi"')

        await expect(page.locator('h1')).toHaveText('Édition d’une offre d’emploi')

        await page.fill('"Intitulé *"', testJobDraft.title)

        await page.fill('"Service recruteur *"', testJobDraft.recruiter.displayName)
        await page.click(`"${testJobDraft.recruiter.displayName}"`)

        await page.fill('div[contenteditable="true"]:below(:text("Mission *"))', testJobDraft.missionDescription)

        await page.click('"Offres d’emploi"')

        await expect(page.locator('h1')).toHaveText('Offres d’emploi')
        await expect(page.locator(`td:has-text("${testJobDraft.title}")`)).toBeVisible()
      })
    }
  })

  test('Jobs Publishing', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Offres d’emploi"')

    await expect(page.locator('h1')).toHaveText('Offres d’emploi')

    for (const testJob of TEST_JOBS) {
      await test.step(testJob.title, async () => {
        await page.click('"Ajouter une offre d’emploi"')

        await expect(page.locator('h1')).toHaveText('Édition d’une offre d’emploi')

        await page.fill('"Intitulé *"', testJob.title)

        await page.fill('"Service recruteur *"', testJob.recruiter.displayName)
        await page.click(`"${testJob.recruiter.displayName}"`)

        await page.fill('"Compétence *"', testJob.profession.name)
        await page.click(`"${testJob.profession.name}"`)

        await page.click('.Select__clear-indicator:below(:text("Types de contrat *"))')
        for (const contractType of testJob.contractTypes) {
          await page.fill('"Types de contrat *"', contractType)
          await page.click(`"${contractType}"`)
        }

        await page.click('.Select__clear-indicator:below(:text("Domaines *"))')
        for (const domain of testJob.domains) {
          await page.fill('"Domaines *"', domain.name)
          await page.click(`"${domain.name}"`)
        }

        await page.fill('"Années d’expérience requises (0 si ouvert aux débutant·es) *"', testJob.seniorityInYears)

        await page.fill('"Télétravail possible *"', testJob.remoteStatus)
        await page.click(`"${testJob.remoteStatus}"`)

        await page.fill('"Adresse *"', testJob.address.input)
        await page.click(`"${testJob.address.label}"`)

        await page.fill('"Contact unique pour les questions *"', testJob.infoContact.name)
        await page.click(`"${testJob.infoContact.name} (${testJob.infoContact.email})"`)

        for (const applicationContact of testJob.applicationContacts) {
          await page.fill('"Contacts pour l’envoi des candidatures **"', applicationContact.name)
          await page.click(`"${applicationContact.name} (${applicationContact.email})"`)
        }

        await page.click('div[contenteditable="true"]:below(:text("Mission *"))')
        await page.keyboard.type(testJob.missionDescription)

        // TODO Investigate why this we need to click twice with a timeout.
        let maxRetries = 5
        while ((await page.locator('h1').textContent()) !== 'Offres d’emploi' && maxRetries > 0) {
          await page.click('"Publier"')
          await page.waitForTimeout(500)

          maxRetries -= 1
        }

        await expect(page.locator('h1')).toHaveText('Offres d’emploi')
        await expect(page.locator(`td:has-text("${testJob.title}")`)).toBeVisible()
      })
    }
  })
})
