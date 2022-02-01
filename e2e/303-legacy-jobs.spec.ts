import { test, expect } from '@playwright/test'

import { JOB_STATE_LABEL } from '../common/constants'
import { TEST_LEGACY_JOBS } from './constants'

test.describe('Admin > Legacy Jobs', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('First Legacy Job Creation', async ({ page }) => {
    const firstTestLegacyJob = TEST_LEGACY_JOBS[0]

    await page.goto('http://localhost:3000/admin')

    await page.click('"Offres" >> nth=1')

    await expect(page.locator('h1')).toHaveText('Offres [LEGACY]')
    await page.click('"Ajouter une offre [LEGACY]"')

    await expect(page.locator('h1')).toHaveText('Nouvelle offre [LEGACY]')

    await page.fill('"Intitulé *"', firstTestLegacyJob.title)
    await page.fill('"État *"', JOB_STATE_LABEL[firstTestLegacyJob.state])
    await page.click(`"${JOB_STATE_LABEL[firstTestLegacyJob.state]}"`)
    await page.click('"Créer"')

    await expect(page.locator('h1')).toHaveText('Offres [LEGACY]')
    await expect(page.locator(`td:has-text("${firstTestLegacyJob.title}")`)).toBeVisible()
  })
})
