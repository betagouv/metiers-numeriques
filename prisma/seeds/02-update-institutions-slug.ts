import ß from 'bhala'

import { slugify } from '../../common/helpers/slugify'

import type { PrismaClient } from '@prisma/client'

export async function updateInstitutionsSlug(prisma: PrismaClient) {
  const institutions = await prisma.institution.findMany()

  ß.info('[prisma/seeds/02-update-institutions-slug.ts] Updating institutions slug…')
  for (const institution of institutions) {
    // eslint-disable-next-line no-await-in-loop
    await prisma.institution.update({
      data: {
        slug: slugify(institution.name, institution.id),
      },
      where: {
        id: institution.id,
      },
    })
  }

  ß.success(`[prisma/seeds/02-update-institutions-slug.ts] Institutions slug updated.`)
}
