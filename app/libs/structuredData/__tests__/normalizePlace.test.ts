import structuredData from '..'

describe('libs/structuredData.normalizePlace()', () => {
  test(`with "20 avenue de Ségur - 75 007 Paris"`, () => {
    const addressString = `20 avenue de Ségur - 75 007 Paris`

    const result = structuredData.normalizePlace(addressString)

    expect(result).toStrictEqual({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressLocality: 'Paris',
        addressRegion: 'Île-de-France',
        postalCode: '75007',
        streetAddress: '20 avenue de Ségur',
      },
    })
  })

  test(`with "39-43 quai André Citroën 75015 Paris "`, () => {
    const addressString = `39-43 quai André Citroën 75015 Paris`

    const result = structuredData.normalizePlace(addressString)

    expect(result).toStrictEqual({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressLocality: 'Paris',
        addressRegion: 'Île-de-France',
        postalCode: '75015',
        streetAddress: '43 quai André Citroën',
      },
    })
  })

  test(`with "1 Av. du Marechal Foch 06000 Nice`, () => {
    const addressString = `1 Av. du Marechal Foch 06000 Nice`

    const result = structuredData.normalizePlace(addressString)

    expect(result).toStrictEqual({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressLocality: 'Nice',
        addressRegion: 'Provence-Alpes-Côte d’Azur',
        postalCode: '06000',
        streetAddress: '1 Av. du Marechal Foch',
      },
    })
  })

  test(`with "Préfecture de Police 71 Rue Albert 75013 Paris`, () => {
    const addressString = `Préfecture de Police 71 Rue Albert 75013 Paris`

    const result = structuredData.normalizePlace(addressString)

    expect(result).toStrictEqual({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressLocality: 'Paris',
        addressRegion: 'Île-de-France',
        postalCode: '75013',
        streetAddress: '71 Rue Albert',
      },
    })
  })

  test(`with "Sainte-Marie La Réunion`, () => {
    const addressString = `Sainte-Marie La Réunion`

    const result = structuredData.normalizePlace(addressString)

    expect(result).toBeUndefined()
  })
})
