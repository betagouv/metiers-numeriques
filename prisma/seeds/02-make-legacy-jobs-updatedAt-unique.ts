/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'
import dayjs from 'dayjs'

import type { PrismaClient } from '@prisma/client'

export async function makeLegacyJobsUpdatedAtUnique(prisma: PrismaClient) {
  const legacyJobs = await prisma.legacyJob.findMany()
  const startTimestampInMs = dayjs().valueOf()
  let counter = 0

  ß.info('Making jobs updatedAt unique…')
  for (const legacyJob of legacyJobs) {
    const legacyJobsWithSameUpdatedAtValueCount = await prisma.legacyJob.count({
      where: {
        updatedAt: legacyJob.updatedAt,
      },
    })

    if (legacyJobsWithSameUpdatedAtValueCount === 1) {
      continue
    }

    const legacyJobsWithSameUpdatedAtValue = await prisma.legacyJob.findMany({
      where: {
        updatedAt: legacyJob.updatedAt,
      },
    })

    for (const legacyJobWithSameUpdatedAtValue of legacyJobsWithSameUpdatedAtValue) {
      const nowTimestampInMs = dayjs().valueOf()
      const diffInMs = nowTimestampInMs - startTimestampInMs
      const newUpdatedAt = dayjs(legacyJobWithSameUpdatedAtValue.updatedAt).add(diffInMs, 'ms').toDate()

      await prisma.legacyJob.update({
        data: {
          updatedAt: newUpdatedAt,
        },
        where: {
          id: legacyJobWithSameUpdatedAtValue.id,
        },
      })

      counter += 1
    }
  }

  ß.success(`${counter} jobs updatedAt made unique.`)
}
