import { test, expect } from '@playwright/test'
import prismaClientPkg from '@prisma/client'

import { TEST_USERS, TEST_USER_ROLE } from './constants.js'

const { PrismaClient } = prismaClientPkg

test.describe('Admin > Authentication', () => {
  test('First User (Administrator) Signup', async ({ page }) => {
    const prisma = new PrismaClient()
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
    await page.fill('"Nom de votre institution"', testAdministrationUser.requestedInstitution)
    await page.fill('"Nom de votre service"', testAdministrationUser.requestedService)
    await page.click('"Envoyer ma demande"')

    await expect(page.locator('h4')).toHaveText('Connexion')

    const userCount = await prisma.user.count()

    if (userCount > 0) {
      await prisma.user.update({
        data: {
          isActive: true,
          role: TEST_USER_ROLE.ADMINISTRATOR as any,
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
    await page.fill('"Nom de votre institution"', testRecruitingUser.requestedInstitution)
    await page.fill('"Nom de votre service"', testRecruitingUser.requestedService)
    await page.click('"Envoyer ma demande"')

    await expect(page.locator('h4')).toHaveText('Connexion')
  })
})
