import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export async function linkUsersInstitution(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    include: {
      recruiter: true,
    },
  })

  ß.info('[prisma/seeds/03-link-users-institution.ts] Linking users institution…')
  for (const user of users) {
    if (user.recruiter === null) {
      // eslint-disable-next-line no-continue
      continue
    }

    // eslint-disable-next-line no-await-in-loop
    await prisma.user.update({
      data: {
        institutionId: user.recruiter.institutionId,
      },
      where: {
        id: user.id,
      },
    })
  }

  ß.success(`[prisma/seeds/03-link-users-institution.ts] Users institution updated.`)
}
