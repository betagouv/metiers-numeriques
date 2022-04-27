import { test, expect } from '@playwright/test'
import { UserRole } from '@prisma/client'

import { prisma } from '../api/libs/prisma'
import { TEST_USERS } from './constants'

const { CI } = process.env
const IS_CI = Boolean(CI)

test.describe('Signup', () => {
  test('First User Signup', async ({ page }) => {
    const firstTestUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

    await page.click('"demander un compte"')
    await page.fill('"Email"', firstTestUser.email)
    await page.fill('"Mot de passe"', firstTestUser.password)
    await page.fill('"Mot de passe (répêter)"', firstTestUser.password)
    await page.fill('"Prénom"', firstTestUser.firstName)
    await page.fill('"Nom"', firstTestUser.lastName)
    await page.click('"Envoyer ma demande"')

    await expect(page.locator('h4')).toHaveText('Connexion')

    if (IS_CI) {
      return
    }

    await prisma.user.update({
      data: {
        isActive: true,
        role: UserRole.ADMINISTRATOR,
      },
      where: {
        email: firstTestUser.email,
      },
    })
  })
})
