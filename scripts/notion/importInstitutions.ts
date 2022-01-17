import ß from 'bhala'
import cuid from 'cuid'

import file from '../../api/libs/file'
import handleError from '../../common/helpers/handleError'
import data from '../../src/services/data'

import type { LegacyInstitution, LegacyInstitutionSection, PrismaClient } from '@prisma/client'

async function importFile(prisma: PrismaClient, { name, url }: Common.Data.File): Promise<string> {
  const id = cuid()

  const result = await file.transfer(id, url)
  if (result === undefined) {
    handleError(new Error('`url` should not be undefined.'), 'scripts/build/importInstitutions.ts#importFile()', true)
  }

  const { type, url: newUrl } = result
  const maybeFile = await prisma.file.findUnique({
    where: {
      url: newUrl,
    },
  })
  if (maybeFile !== null) {
    return maybeFile.id
  }

  await prisma.file.create({
    data: {
      id,
      title: name,
      type,
      url: newUrl,
    },
  })

  return id
}

async function importFiles(prisma: PrismaClient, dataFiles: Common.Data.File[]): Promise<string[]> {
  return Promise.all(dataFiles.map(dataFile => importFile(prisma, dataFile)))
}

async function makeFileConnections(
  prisma: PrismaClient,
  dataFiles: Common.Data.File[],
  section: LegacyInstitutionSection,
): Promise<
  Array<{
    file: {
      connect: {
        id: string
      }
    }
    section: LegacyInstitutionSection
  }>
> {
  const fileIds = await importFiles(prisma, dataFiles)

  return fileIds.map(fileId => ({
    file: {
      connect: {
        id: fileId,
      },
    },
    section,
  }))
}

export default async function importInstitutions(prisma: PrismaClient) {
  try {
    const importedInstitutionsCount = await prisma.legacyInstitution.count()
    if (importedInstitutionsCount > 0) {
      return
    }

    ß.info('Fetching Notion institutions…')
    const rawInstitutions = await data.getInstitutions()
    const importedInstitutionIds = (await prisma.legacyInstitution.findMany()).map(({ id }) => id)
    const newRawInstitutions = rawInstitutions.filter(({ id }) => !importedInstitutionIds.includes(id))

    ß.info('Importing Notion institutions files…')
    const newLegacyInstitutions: LegacyInstitution[] = await Promise.all(
      newRawInstitutions.map(
        async ({
          addressFiles,
          joinTeamFiles,
          keyNumbersFiles,
          logoFile,
          motivationFiles,
          organizationFiles,
          projectFiles,
          testimonialFiles,
          thumbnailFile,
          valueFiles,
          ...institution
        }) => {
          const files = {
            create: [
              ...(await makeFileConnections(prisma, addressFiles, 'address')),
              ...(await makeFileConnections(prisma, joinTeamFiles, 'joinTeam')),
              ...(await makeFileConnections(prisma, keyNumbersFiles, 'keyNumbers')),
              ...(await makeFileConnections(prisma, motivationFiles, 'motivation')),
              ...(await makeFileConnections(prisma, organizationFiles, 'organization')),
              ...(await makeFileConnections(prisma, projectFiles, 'project')),
              ...(await makeFileConnections(prisma, testimonialFiles, 'testimonial')),
              ...(await makeFileConnections(prisma, valueFiles, 'value')),
            ],
          }
          const logoFileId = logoFile ? await importFile(prisma, logoFile) : null
          const thumbnailFileId = thumbnailFile ? await importFile(prisma, thumbnailFile) : null

          return {
            ...institution,
            files,
            logoFileId,
            thumbnailFileId,
          }
        },
      ),
    )

    ß.info('Updating Notion institutions…')
    const result = await Promise.all(
      newLegacyInstitutions.map(newLegacyInstitution =>
        prisma.legacyInstitution.create({
          data: newLegacyInstitution,
        }),
      ),
    )

    ß.success(`Imported ${result.length} Notion institutions.`)
  } catch (err) {
    handleError(err, 'scripts/build/importInstitutions.ts', true)
  }
}
