import ß from 'bhala'

import handleError from '../../common/helpers/handleError'
import data from '../../src/services/data'

import type { PrismaClient } from '@prisma/client'

export default async function importEntities(prisma: PrismaClient) {
  try {
    const importedEntitiesCount = await prisma.legacyEntity.count()
    if (importedEntitiesCount > 0) {
      return
    }

    ß.info('Fetching Notion entities…')
    const entities = await data.getEntities()

    ß.info('Updating Notion entities…')
    const result = await prisma.legacyEntity.createMany({
      data: entities,
      skipDuplicates: true,
    })

    ß.success(`Imported ${result.count} Notion entities.`)
  } catch (err) {
    handleError(err, 'scripts/build/importEntities.ts', true)
  }
}
