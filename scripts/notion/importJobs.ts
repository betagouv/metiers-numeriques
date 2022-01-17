import ß from 'bhala'

import handleError from '../../common/helpers/handleError'
import data from '../../src/services/data'

import type { JobSource, PrismaClient } from '@prisma/client'

export default async function importJobs(prisma: PrismaClient) {
  try {
    const importedJobsCount = await prisma.legacyJob.count()
    if (importedJobsCount > 0) {
      return
    }

    ß.info('Fetching Notion jobs…')
    const jobs = await data.getJobs()

    const jobsWithSource = jobs.map(job => ({
      ...job,
      source: job.reference.substring(0, 3) as JobSource,
    }))

    ß.info('Updating Notion jobs…')
    const result = await prisma.legacyJob.createMany({
      data: jobsWithSource,
      skipDuplicates: true,
    })
    ß.success(`Imported ${result.count} Notion jobs.`)
  } catch (err) {
    handleError(err, 'scripts/build/importJobs.ts', true)
  }
}
