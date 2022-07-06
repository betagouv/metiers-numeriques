import { test, expect } from '@playwright/test'

import { TEST_TESTIMONIES } from './constants.js'

test.describe('Admin > Testimonies', () => {
  test.use({
    storageState: './e2e/states/administrator.json',
  })

  test('Testimonies Creation', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')
    await page.click('"Témoignages"')

    await expect(page.locator('h1')).toHaveText('Témoignages')

    for (const testTestimony of TEST_TESTIMONIES) {
      await page.click('"Ajouter un témoignage"')

      await expect(page.locator('h1')).toHaveText('Nouveau témoignage')

      await page.fill('"Institution *"', testTestimony.institution.name)
      await page.click(`"${testTestimony.institution.name}"`)
      await page.fill('"Nom *"', testTestimony.name)
      await page.fill('"Profession *"', testTestimony.job)
      await page.fill('"Témoignage *"', testTestimony.testimony)

      const [fileChooser] = await Promise.all([
        // It is important to call waitForEvent before click to set up waiting.
        page.waitForEvent('filechooser'),
        // Opens the file chooser.
        page.locator('"Choisir un fichier"').click(),
      ])
      await fileChooser.setFiles('./e2e/image.jpg')

      await page.click('"Créer"')

      await expect(page.locator('h1')).toHaveText('Témoignages')
      await expect(page.locator(`td:has-text("${testTestimony.name}")`)).toBeVisible()
    }
  })
})
