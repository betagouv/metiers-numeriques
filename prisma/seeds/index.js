import prismaClientPkg from '@prisma/client'
import { B } from 'bhala'

import { initializeProfessions } from './01-initialize-professions.js'

const { PrismaClient } = prismaClientPkg

const prisma = new PrismaClient()

async function seed() {
  try {
    await initializeProfessions(prisma)
  } catch (err) {
    B.error('[prisma/seeds/index.ts > seed()]', String(err))
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

seed()
