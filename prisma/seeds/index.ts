import getPrisma from '../../api/helpers/getPrisma'
import handleError from '../../common/helpers/handleError'
import initializeState from './01-initialize-jobs-state'

async function seed() {
  const prisma = getPrisma()

  try {
    await initializeState(prisma)
  } catch (err) {
    handleError(err, 'prisma/seeds/index.ts > seed()')
  } finally {
    await prisma.$disconnect()
  }
}

seed()
