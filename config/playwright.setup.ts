import dotenv from 'dotenv'

import getPrisma from '../api/helpers/getPrisma'
import { FIRST_USER } from '../e2e/constants'

import type { FullConfig } from '@playwright/test'

dotenv.config()

const { CI } = process.env
const IS_CI = Boolean(CI)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(config: FullConfig) {
  const prisma = getPrisma()

  if (!IS_CI) {
    const firstUserCount = await prisma.user.count({
      where: {
        email: FIRST_USER.email,
      },
    })

    if (firstUserCount > 0) {
      await prisma.user.delete({
        where: {
          email: FIRST_USER.email,
        },
      })
    }
  }
}
