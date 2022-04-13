import getPrisma from '../../api/helpers/getPrisma'
import handleError from '../../common/helpers/handleError'
import { initializeProfessions } from './01-initialize-professions'

async function seed() {
  const prisma = getPrisma()

  try {
    await initializeProfessions(prisma)
  } catch (err) {
    handleError(err, 'prisma/seeds/index.ts > seed()')
  } finally {
    await prisma.$disconnect()
  }
}

seed()
