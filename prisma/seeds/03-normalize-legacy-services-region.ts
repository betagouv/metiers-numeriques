/* eslint-disable no-await-in-loop, no-continue */

import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export async function normalizeLegacyServicesRegion(prisma: PrismaClient) {
  const whereFilter = {
    where: {
      region: `Provence-Alpes-Côte d'Azur`,
    },
  }

  const abnormalLegacyServicesCount = await prisma.legacyService.count(whereFilter)

  if (abnormalLegacyServicesCount === 0) {
    return
  }

  ß.info('Normalizing legacy services region…')
  const abnormalLegacyServices = await prisma.legacyService.findMany(whereFilter)

  let counter = 0

  for (const abnormalLegacyService of abnormalLegacyServices) {
    await prisma.legacyService.update({
      data: {
        region: 'Provence-Alpes-Côte d’Azur',
      },
      where: {
        id: abnormalLegacyService.id,
      },
    })

    counter += 1
  }

  ß.success(`${counter} legacy services region normalized.`)
}
