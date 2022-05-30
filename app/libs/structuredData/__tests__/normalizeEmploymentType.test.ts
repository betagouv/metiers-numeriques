/**
 * @jest-environment jsdom
 */

import { structuredData } from '..'

import type { JobContractType } from '@prisma/client'

describe('libs/structuredData.normalizeEmploymentType()', () => {
  test(`with a valid list`, () => {
    const contractTypes: JobContractType[] = [
      'CONTRACT_WORKER',
      'FREELANCER',
      'INTERN',
      'INTERNATIONAL_VOLUNTEER',
      'NATIONAL_CIVIL_SERVANT',
      'PERMANENT',
      'TEMPORARY',
    ]

    const result = structuredData.normalizeEmploymentType(contractTypes)

    expect(result).toMatchObject(['CONTRACTOR', 'INTERN', 'VOLUNTEER', 'OTHER', 'TEMPORARY', 'FULL_TIME'])
  })

  test(`with a part time`, () => {
    const contractTypes: JobContractType[] = ['CONTRACT_WORKER', 'PART_TIME']

    const result = structuredData.normalizeEmploymentType(contractTypes)

    expect(result).toMatchObject(['CONTRACTOR', 'PART_TIME'])
  })
})
