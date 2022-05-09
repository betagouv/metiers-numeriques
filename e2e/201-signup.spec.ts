import { test, expect } from '@playwright/test'
import { UserRole } from '@prisma/client'

import { prisma } from '../api/libs/prisma'
import { TEST_USERS } from './constants'

test.describe('Admin > Authentication', () => {
  test('First User (Administrator) Signup', async ({ page }) => {
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h4')).toHaveText('Connexion')

    await page.click('"demander un compte"')

    await expect(page.locator('h4')).toHaveText('Demande de création d’un compte')

    await page.fill('"Email"', testAdministrationUser.email)
    await page.fill('"Mot de passe"', testAdministrationUser.password)
    await page.fill('"Mot de passe (répêter)"', testAdministrationUser.password)
    await page.fill('"Prénom"', testAdministrationUser.firstName)
    await page.fill('"Nom"', testAdministrationUser.lastName)
    await page.click('"Envoyer ma demande"')

    await expect(page.locator('h4')).toHaveText('Connexion')

    const userCount = await prisma.user.count()

    if (userCount > 0) {
      await prisma.user.update({
        data: {
          isActive: true,
          role: UserRole.ADMINISTRATOR,
        },
        where: {
          email: testAdministrationUser.email,
        },
      })
    }
  })

  test('Second User (Recruiter) Signup', async ({ page }) => {
    const testRecruitingUser = TEST_USERS[1]

    await page.goto('http://localhost:3000/admin')

    await expect(page.locator('h4')).toHaveText('Connexion')

    await page.click('"demander un compte"')

    await expect(page.locator('h4')).toHaveText('Demande de création d’un compte')

    await page.fill('"Email"', testRecruitingUser.email)
    await page.fill('"Mot de passe"', testRecruitingUser.password)
    await page.fill('"Mot de passe (répêter)"', testRecruitingUser.password)
    await page.fill('"Prénom"', testRecruitingUser.firstName)
    await page.fill('"Nom"', testRecruitingUser.lastName)
    await page.click('"Envoyer ma demande"')

    await expect(page.locator('h4')).toHaveText('Connexion')
  })
})
