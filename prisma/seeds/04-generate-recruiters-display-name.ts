import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export async function generateRecruitersDisplayName(prisma: PrismaClient) {
  const recruiters = await prisma.recruiter.findMany()

  ß.info('Generating recruiters display name…')
  for (const recruiter of recruiters) {
    if (recruiter.displayName !== 'null') {
      // eslint-disable-next-line no-continue
      continue
    }

    const { name } = recruiter

    // eslint-disable-next-line no-await-in-loop
    await prisma.recruiter.update({
      data: {
        displayName: name,
      },
      where: {
        id: recruiter.id,
      },
    })
  }

  ß.success(`Recruiters display name generated.`)
}
