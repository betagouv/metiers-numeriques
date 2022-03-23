import { structuredData } from '..'

import type { Recruiter } from '@prisma/client'

describe('libs/structuredData.normalizeOrganization()', () => {
  test(`with no {websiteUrl}`, () => {
    const recruiter: Recruiter = {
      createdAt: new Date(),
      fullName: null,
      id: '',
      institutionId: null,
      logoFileId: null,
      name: `Grand Besançon Métropole`,
      parentId: null,
      updatedAt: new Date(),
      websiteUrl: null,
    }

    const result = structuredData.normalizeOrganization(recruiter)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      name: 'Grand Besançon Métropole',
    })
  })

  test(`with an empty {websiteUrl}`, () => {
    const recruiter: Recruiter = {
      createdAt: new Date(),
      fullName: null,
      id: '',
      institutionId: null,
      logoFileId: null,
      name: `Grand Besançon Métropole`,
      parentId: null,
      updatedAt: new Date(),
      websiteUrl: '',
    }

    const result = structuredData.normalizeOrganization(recruiter)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      name: 'Grand Besançon Métropole',
    })
  })

  test(`with a non-empty {websiteUrl}`, () => {
    const recruiter: Recruiter = {
      createdAt: new Date(),
      fullName: null,
      id: '',
      institutionId: null,
      logoFileId: null,
      name: `Ministère de l’économie, des finances et de la relance`,
      parentId: null,
      updatedAt: new Date(),
      websiteUrl: `https://www.economie.gouv.fr`,
    }

    const result = structuredData.normalizeOrganization(recruiter)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      name: 'Ministère de l’économie, des finances et de la relance',
      sameAs: 'https://www.economie.gouv.fr',
    })
  })
})
