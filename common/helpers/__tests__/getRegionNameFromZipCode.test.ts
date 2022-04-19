/**
 * @jest-environment jsdom
 */

import { getRegionNameFromZipCode } from '../getRegionNameFromZipCode'

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

  test(`with "00000"`, () => {
    const zipCode = '00000'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toBeUndefined()
  })

  test(`with "123"`, () => {
    const zipCode = '123'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toBeUndefined()
  })

  test(`with "123456"`, () => {
    const zipCode = '123456'

    const result = getRegionNameFromZipCode(zipCode)

    expect(result).toBeUndefined()
  })

  test(`with undefined`, () => {
    const zipCode = undefined

    const result = getRegionNameFromZipCode(zipCode as any)

    expect(result).toBeUndefined()
  })
})
