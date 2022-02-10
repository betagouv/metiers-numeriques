import structuredData from '..'

import type { Recruiter } from '@prisma/client'

describe('libs/structuredData.normalizeOrganization()', () => {
  test(`with "Grand Besançon Métropole"`, () => {
    const recruiter: Recruiter = {
      createdAt: new Date(),
      fullName: null,
      id: '',
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

  test(`with "Ministère de l’économie, des finances et de la relance", "https://www.economie.gouv.fr"`, () => {
    const recruiter: Recruiter = {
      createdAt: new Date(),
      fullName: null,
      id: '',
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
