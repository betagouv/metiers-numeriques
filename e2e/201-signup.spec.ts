import { test, expect } from '@playwright/test'
import { UserRole } from '@prisma/client'

import getPrisma from '../api/helpers/getPrisma'
import { FIRST_USER } from './constants'

const { CI } = process.env
const IS_CI = Boolean(CI)

test.describe('Signup', () => {
  const prisma = getPrisma()

  test('First User Signup', async ({ page }) => {
    await page.goto('http://localhost:3000/admin')

    await page.click('text=demander un compte')
    await page.fill('[name="signUpEmail"]', FIRST_USER.email)
    await page.fill('[name="signUpPassword"]', FIRST_USER.password)
    await page.fill('[name="signUpPasswordConfirmation"]', FIRST_USER.password)
    await page.fill('[name="signUpFirstName"]', FIRST_USER.firstName)
    await page.fill('[name="signUpLastName"]', FIRST_USER.lastName)
    await page.click('text=Envoyer ma demande')

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
        email: FIRST_USER.email,
      },
    })
  })
})
