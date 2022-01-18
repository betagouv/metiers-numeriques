import getRegionNameFromZipCode from '../getRegionNameFromZipCode'

describe('app/helpers/getRegionNameFromZipCode()', () => {
  test(`with "1234"`, () => {
    const zipCode = '1234'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toEqual('Auvergne-Rhône-Alpes')
  })

  test(`with "12345"`, () => {
    const zipCode = '12345'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toEqual('Occitanie')
  })

  test(`with "97400"`, () => {
    const zipCode = '97400'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toEqual('La Réunion')
  })
})
