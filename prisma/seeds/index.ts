import getPrisma from '../../api/helpers/getPrisma'
import handleError from '../../common/helpers/handleError'
import { initializeLegacyJobsState } from './01-initialize-legacy-jobs-state'
import { makeLegacyJobsUpdatedAtUnique } from './02-make-legacy-jobs-updatedAt-unique'
import { normalizeLegacyServicesRegion } from './03-normalize-legacy-services-region'
import { cleanLegacyJobsEmailLinks } from './04-clean-legacy-jobs-email-links'

async function seed() {
  const prisma = getPrisma()

  try {
    await initializeLegacyJobsState(prisma)
    await makeLegacyJobsUpdatedAtUnique(prisma)
    await normalizeLegacyServicesRegion(prisma)
    await cleanLegacyJobsEmailLinks(prisma)
  } catch (err) {
    handleError(err, 'prisma/seeds/index.ts > seed()')
  } finally {
    await prisma.$disconnect()
  }
}

seed()
