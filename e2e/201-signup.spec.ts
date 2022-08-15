import { test, expect } from '@playwright/test'
import prismaClientPkg from '@prisma/client'

import { TEST_USERS, TEST_USER_ROLE } from './constants.js'

const { PrismaClient } = prismaClientPkg

test.describe('Admin > Authentication', () => {
  test('First User (Administrator) Signup', async ({ page }) => {
    const prisma = new PrismaClient()
    const testAdministrationUser = TEST_USERS[0]

    await page.goto('http://localhost:3000/inscription')

    await expect(page.locator('h1')).toHaveText("S'inscrire")

    await page.click('"Employeur public"')
    await page.click('"S\'inscrire par email"')

    await page.fill('"Prénom"', testAdministrationUser.firstName)
    await page.fill('"Nom"', testAdministrationUser.lastName)
    await page.fill('"Email"', testAdministrationUser.email)
    await page.fill('"Mot de passe"', testAdministrationUser.password)
    await page.fill('"Confirmer le mot de passe"', testAdministrationUser.password)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText('Demande de compte recruteur')

    await page.fill('"Mon Institution"', testAdministrationUser.requestedInstitution)
    await page.fill('"Mon service recruteur"', testAdministrationUser.requestedService)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText("C'est tout bon !")

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

    await page.goto('http://localhost:3000/inscription')

    await expect(page.locator('h1')).toHaveText("S'inscrire")

    await page.click('"Employeur public"')
    await page.click('"S\'inscrire par email"')

    await page.fill('"Prénom"', testRecruitingUser.firstName)
    await page.fill('"Nom"', testRecruitingUser.lastName)
    await page.fill('"Email"', testRecruitingUser.email)
    await page.fill('"Mot de passe"', testRecruitingUser.password)
    await page.fill('"Confirmer le mot de passe"', testRecruitingUser.password)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText('Demande de compte recruteur')

    await page.fill('"Mon Institution"', testRecruitingUser.requestedInstitution)
    await page.fill('"Mon service recruteur"', testRecruitingUser.requestedService)
    await page.click('button[type=submit]')

    await expect(page.locator('h1')).toHaveText("C'est tout bon !")
  })
})
