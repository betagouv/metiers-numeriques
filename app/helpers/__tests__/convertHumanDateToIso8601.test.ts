import { convertHumanDateToIso8601 } from '../convertHumanDateToIso8601'

describe('app/helpers/convertHumanDateToIso8601()', () => {
  test(`with a valid ISO date`, () => {
    const date = '10/02/2022'

    const result = convertHumanDateToIso8601(date)

    expect(result).toEqual('2022-02-10')
  })

  test(`with undefined`, () => {
    const date = undefined

    const result = convertHumanDateToIso8601(date as any)

    expect(result).toEqual('')
  })
})
