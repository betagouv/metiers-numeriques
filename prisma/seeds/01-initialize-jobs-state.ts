import { JobState } from '@prisma/client'
import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export default async function initializeJobsState(prisma: PrismaClient) {
  const nonDraftJobsCount = await prisma.legacyJob.count({
    where: {
      state: JobState.PUBLISHED,
    },
  })

  if (nonDraftJobsCount > 0) {
    return
  }

  ß.info('Initializing jobs state…')
  await prisma.legacyJob.updateMany({
    data: {
      state: JobState.PUBLISHED,
    },
  })

  ß.success('Jobs state initialized.')
}
