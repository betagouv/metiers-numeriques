import ß from 'bhala'

import getPrisma from '../../api/helpers/getPrisma'
import file from '../../api/libs/file'
import { FILE_TYPE } from '../../common/constants'
import handleError from '../../common/helpers/handleError'

async function deleteAll() {
  try {
    const prisma = getPrisma()

    ß.info('Deleting Notion jobs…')
    const jobsResult = await prisma.legacyJob.deleteMany()
    ß.success(`Deleted ${jobsResult.count} legacy jobs.`)

    ß.info('Deleting legacy services…')
    const servicesResult = await prisma.legacyService.deleteMany()
    ß.success(`Deleted ${servicesResult.count} legacy services.`)

    ß.info('Deleting legacy entities…')
    const entitiesResult = await prisma.legacyEntity.deleteMany()
    ß.success(`Deleted ${entitiesResult.count} legacy entities.`)

    ß.info('Deleting legacy institutions…')
    const institutionsResult = await prisma.legacyInstitution.deleteMany()
    ß.success(`Deleted ${institutionsResult.count} legacy institutions.`)

    ß.info('Deleting files…')
    const files = await prisma.file.findMany()
    await Promise.all(
      files.map(({ id, type }) => {
        const extension = FILE_TYPE[type].ext

        return file.delete(id, extension)
      }),
    )
    await prisma.filesOnLegacyInstitutions.deleteMany()
    const filesResult = await prisma.file.deleteMany()
    ß.success(`Deleted ${filesResult.count} files.`)
  } catch (err) {
    handleError(err, 'scripts/build/deleteAll.ts', true)
  }
}

deleteAll()
