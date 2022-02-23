/**
 * @jest-environment jsdom
 */

import { getCountryFromCode } from '../getCountryFromCode'

describe('app/helpers/getCountryFromCode()', () => {
  test(`with an existing code`, () => {
    const countryCode = 'FR'

    const result = getCountryFromCode(countryCode)

    expect(result).toEqual('France')
  })

  test(`with a nonexitent code`, () => {
    const countryCode = 'ZZ'

    const result = getCountryFromCode(countryCode)

    expect(result).toEqual('[PAYS INCONNU]')
  })
})
