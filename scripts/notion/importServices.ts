import ß from 'bhala'

import handleError from '../../common/helpers/handleError'
import data from '../../src/services/data'

import type { PrismaClient } from '@prisma/client'

export default async function importServices(prisma: PrismaClient) {
  try {
    const importedServicesCount = await prisma.legacyService.count()
    if (importedServicesCount > 0) {
      return
    }

    ß.info('Fetching Notion services…')
    const services = await data.getServices()

    ß.info('Updating Notion services…')
    const result = await prisma.legacyService.createMany({
      data: services,
      skipDuplicates: true,
    })

    ß.success(`Imported ${result.count} Notion services.`)
  } catch (err) {
    handleError(err, 'scripts/build/importServices.ts', true)
  }
}
