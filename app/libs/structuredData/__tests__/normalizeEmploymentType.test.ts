import { structuredData } from '..'

import type { JobContractType } from '@prisma/client'

describe('libs/structuredData.normalizeEmploymentType()', () => {
  test(`with a valid list`, () => {
    const contractTypes: JobContractType[] = [
      'CONTRACT_WORKER',
      'FREELANCER',
      'FULL_TIME',
      'INTERN',
      'INTERNATIONAL_VOLUNTEER',
      'NATIONAL_CIVIL_SERVANT',
      'PART_TIME',
      'PERMANENT',
      'TEMPORARY',
    ]

    const result = structuredData.normalizeEmploymentType(contractTypes)

    expect(result).toMatchObject(['CONTRACTOR', 'FULL_TIME', 'INTERN', 'VOLUNTEER', 'OTHER', 'PART_TIME', 'TEMPORARY'])
  })
})
