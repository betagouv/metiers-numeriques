/**
 * @jest-environment jsdom
 */

import { structuredData } from '..'

import type { Address } from '@prisma/client'

describe('libs/structuredData.normalizePlace()', () => {
  test(`with "20 avenue de Ségur - 75 007 Paris"`, () => {
    const address: Address = {
      city: 'Paris',
      country: 'FR',
      createdAt: new Date(),
      id: '',
      postalCode: '75007',
      region: 'Île-de-France',
      sourceId: '',
      street: '20 avenue de Ségur',
      updatedAt: new Date(),
    }

    const result = structuredData.normalizePlace(address)

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
})
