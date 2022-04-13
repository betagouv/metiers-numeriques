import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export async function migrateInstitutionsFullNameToName(prisma: PrismaClient) {
  const institutions = await prisma.institution.findMany()

  ß.info('Migrating institutions full name to name…')
  for (const institution of institutions) {
    if (institution.fullName === null) {
      // eslint-disable-next-line no-continue
      continue
    }

    // eslint-disable-next-line no-await-in-loop
    await prisma.institution.update({
      data: {
        name: institution.fullName,
      },
      where: {
        id: institution.id,
      },
    })
  }

  ß.success('Institutions full name to name migrated.')
}
