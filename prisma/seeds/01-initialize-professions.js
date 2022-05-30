import { B } from 'bhala'
import * as R from 'ramda'

const INITIAL_PROFESSION_NAMES = [
  'Architecture',
  'Autres',
  'Développement',
  'Données',
  'Gestion',
  'Infrastructure',
  'Projet / Produit',
  'Sécurité',
  'Serveur / Cloud',
  'Support',
]

const findMissingProfessionNames = R.difference(INITIAL_PROFESSION_NAMES)
const mapProfessionsToNames = R.map(R.prop('name'))
const mapNamesToProfessions = R.map(name => ({ name }))

export async function initializeProfessions(prisma) {
  const professions = await prisma.profession.findMany()

  const professionNames = mapProfessionsToNames(professions)
  const missingProfessionNames = findMissingProfessionNames(professionNames)
  const missingProfessions = mapNamesToProfessions(missingProfessionNames)

  if (missingProfessions.length > 0) {
    B.info('[prisma/seeds/01-initialize-professions.mjs] Seeding missing professions…')
    const { count } = await prisma.profession.createMany({
      data: missingProfessions,
      skipDuplicates: true,
    })

    B.success(`[prisma/seeds/01-initialize-professions.mjs] ${count} missing profession(s) seeded.`)
  }
}
