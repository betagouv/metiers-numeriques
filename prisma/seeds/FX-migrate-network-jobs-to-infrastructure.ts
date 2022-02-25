import ß from 'bhala'

import type { PrismaClient } from '@prisma/client'

export async function migrateNetworkJobsToInsfrastructure(prisma: PrismaClient) {
  const infrastructureProfession = await prisma.profession.findUnique({
    where: {
      name: 'Infrastructure',
    },
  })
  if (infrastructureProfession === null) {
    return
  }

  const networkProfession = await prisma.profession.findUnique({
    where: {
      name: 'Réseau & Télécom',
    },
  })
  if (networkProfession === null) {
    return
  }

  ß.info('Migrating network jobs to infrastructure…')
  const updatedJobs = await prisma.job.updateMany({
    data: {
      professionId: infrastructureProfession.id,
    },
    where: {
      professionId: networkProfession.id,
    },
  })

  ß.success(`${updatedJobs.count} jobs updated.`)

  ß.info('Migrating network archived jobs to infrastructure…')
  const updatedArchivedJobs = await prisma.archivedJob.updateMany({
    data: {
      professionId: infrastructureProfession.id,
    },
    where: {
      professionId: networkProfession.id,
    },
  })

  ß.success(`${updatedArchivedJobs.count} archived jobs updated.`)
}
