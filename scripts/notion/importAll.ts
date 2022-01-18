import getPrisma from '../../api/helpers/getPrisma'
import handleError from '../../common/helpers/handleError'
import importEntities from './importEntities'
import importInstitutions from './importInstitutions'
import importJobs from './importJobs'
import importServices from './importServices'

const { CI } = process.env
const IS_CI = Boolean(CI)

async function importAll() {
  try {
    if (IS_CI) {
      return
    }

    const prisma = getPrisma()

    await importEntities(prisma)
    await importInstitutions(prisma)
    await importServices(prisma)
    await importJobs(prisma)

    await prisma.$disconnect()

    process.exit()
  } catch (err) {
    handleError(err, 'scripts/build/importAll.ts', true)
  }
}

importAll()
