/* eslint-disable no-await-in-loop */

import dotenv from 'dotenv'

import getPrisma from '../api/helpers/getPrisma'
import { TEST_USERS } from '../e2e/constants'

import type { FullConfig } from '@playwright/test'

dotenv.config()

const { CI } = process.env
const IS_CI = Boolean(CI)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(config: FullConfig) {
  if (IS_CI) {
    return
  }

  const prisma = getPrisma()

  await prisma.legacyJob.deleteMany({
    where: {
      title: {
        startsWith: '$$',
      },
    },
  })

  await prisma.legacyService.deleteMany({
    where: {
      name: {
        startsWith: '$$',
      },
    },
  })

  await prisma.legacyEntity.deleteMany({
    where: {
      name: {
        startsWith: '$$',
      },
    },
  })

  for (const testUser of TEST_USERS) {
    const user = await prisma.user.findUnique({
      where: {
        email: testUser.email,
      },
    })

    if (user !== null) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId: user.id,
        },
      })

      await prisma.user.delete({
        where: {
          email: testUser.email,
        },
      })
    }
  }
}
