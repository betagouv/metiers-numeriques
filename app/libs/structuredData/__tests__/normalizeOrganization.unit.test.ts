import structuredData from '..'

describe('libs/structuredData.normalizeOrganization()', () => {
  test(`with "Grand Besançon Métropole"`, () => {
    const params = {
      name: `Grand Besançon Métropole`,
    }

    const result = structuredData.normalizeOrganization(params)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      name: 'Grand Besançon Métropole',
    })
  })

  test(`with "Ministère de l’économie, des finances et de la relance", "https://www.economie.gouv.fr"`, () => {
    const params = {
      name: `Ministère de l’économie, des finances et de la relance`,
      websiteUrl: `https://www.economie.gouv.fr`,
    }

    const result = structuredData.normalizeOrganization(params)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      name: 'Ministère de l’économie, des finances et de la relance',
      sameAs: 'https://www.economie.gouv.fr',
    })
  })

  test(`with "ARCEP", "https://www.arcep.fr", "https://www.arcep.fr/images/logo-arcep.svg`, () => {
    const params = {
      logoUrl: `https://www.arcep.fr/images/logo-arcep.svg`,
      name: `ARCEP`,
      websiteUrl: `https://www.arcep.fr`,
    }

    const result = structuredData.normalizeOrganization(params)

    expect(result).toStrictEqual({
      '@type': 'Organization',
      logo: 'https://www.arcep.fr/images/logo-arcep.svg',
      name: 'ARCEP',
      sameAs: 'https://www.arcep.fr',
    })
  })
})
