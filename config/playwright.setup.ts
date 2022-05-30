/* eslint-disable no-await-in-loop */

import prismaClientPkg from '@prisma/client'
import dotenv from 'dotenv'

import { TEST_USERS } from '../e2e/constants.js'

import type { FullConfig } from '@playwright/test'

dotenv.config()

const { CI } = process.env
const IS_CI = Boolean(CI)

const { PrismaClient } = prismaClientPkg

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function globalSetup(config: FullConfig) {
  if (IS_CI) {
    return
  }

  const prisma = new PrismaClient()

  await prisma.address.deleteMany({
    where: {
      street: {
        startsWith: '$$',
      },
    },
  })

  await prisma.archivedJob.deleteMany({
    where: {
      title: {
        startsWith: '$$',
      },
    },
  })

  await prisma.contact.deleteMany({
    where: {
      name: {
        startsWith: '$$',
      },
    },
  })

  await prisma.file.deleteMany({
    where: {
      title: {
        startsWith: '$$',
      },
    },
  })

  await prisma.institution.deleteMany({
    where: {
      name: {
        startsWith: '$$',
      },
    },
  })

  await prisma.job.deleteMany({
    where: {
      title: {
        startsWith: '$$',
      },
    },
  })

  await prisma.profession.deleteMany({
    where: {
      name: {
        startsWith: '$$',
      },
    },
  })

  await prisma.recruiter.deleteMany({
    where: {
      displayName: {
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
