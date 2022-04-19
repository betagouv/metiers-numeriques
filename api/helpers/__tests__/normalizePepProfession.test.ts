import ß from 'bhala'

import { normalizePepProfession } from '../normalizePepProfession'

import type { Profession } from '@prisma/client'

describe('api/helpers/normalizePepProfession()', () => {
  const professions = [
    {
      id: 'ar',
      name: 'Architecture',
    },
    {
      id: 'ge',
      name: 'Gestion',
    },
  ] as Profession[]

  test(`with "Architecte technique"`, () => {
    const pepProfession = 'Architecte technique'

    const result = normalizePepProfession(professions, pepProfession)

    expect(result).toBe('ar')
  })

  test(`with "Chief Digital Officer"`, () => {
    const pepProfession = 'Chief Digital Officer'

    const result = normalizePepProfession(professions, pepProfession)

    expect(result).toBe('ge')
  })

  test(`with an unhandled PEP profession`, () => {
    const pepProfession = 'An unhandled PEP profession'

    const result = normalizePepProfession(professions, pepProfession)

    expect(result).toBeUndefined()
    expect(ß.error).toHaveBeenCalledTimes(1)
  })
})
