/**
 * @jest-environment jsdom
 */

import { convertGeocodeJsonFeatureToPrismaAddress } from '../convertGeocodeJsonFeatureToPrismaAddress'

describe('app/helpers/convertGeocodeJsonFeatureToPrismaAddress()', () => {
  test(`with a common feature`, () => {
    const feature: Common.GeocodeJsonFeature = {
      geometry: {
        coordinates: [2.310055, 48.844898],
        type: 'Point',
      },
      properties: {
        city: 'Paris',
        citycode: '75115',
        context: '75, Paris, Île-de-France',
        district: 'Paris 15e Arrondissement',
        housenumber: '10',
        id: '75115_5456_00010',
        importance: 0.8523,
        label: '10 Rue Lecourbe 75015 Paris',
        name: '10 Rue Lecourbe',
        postcode: '75015',
        score: 0.8956636363636363,
        street: 'Rue Lecourbe',
        type: 'housenumber',
        x: 649365.43,
        y: 6860760.31,
      },
      type: 'Feature',
    }

    const result = convertGeocodeJsonFeatureToPrismaAddress(feature)

    expect(result).toStrictEqual({
      city: 'Paris',
      country: 'FR',
      postalCode: '75015',
      region: 'Île-de-France',
      sourceId: '75115_5456_00010',
      street: '10 Rue Lecourbe',
    })
  })
})
