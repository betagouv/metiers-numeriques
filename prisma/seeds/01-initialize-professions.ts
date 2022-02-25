import ß from 'bhala'
import * as R from 'ramda'

import type { PrismaClient } from '@prisma/client'

const INITIAL_PROFESSION_NAMES = [
  'Architecture',
  'Autres',
  'Développement',
  'Données',
  'Infrastructure',
  'Projet / Produit',
  'Sécurité',
  'Serveur / Cloud',
  'Support',
]

const findMissingProfessionNames = R.difference(INITIAL_PROFESSION_NAMES)
const mapProfessionsToNames = R.map(R.prop('name'))
const mapNamesToProfessions: (names: string[]) => Array<{
  name: string
}> = R.map(name => ({ name }))

export async function initializeProfessions(prisma: PrismaClient) {
  const professions = await prisma.profession.findMany()

  const professionNames = mapProfessionsToNames(professions)
  const missingProfessionNames = findMissingProfessionNames(professionNames)
  const missingProfessions = mapNamesToProfessions(missingProfessionNames)

  if (missingProfessions.length > 0) {
    ß.info('Initializing professions…')
    await prisma.profession.createMany({
      data: missingProfessions,
    })

    ß.success('Professions initialized.')
  }
}
