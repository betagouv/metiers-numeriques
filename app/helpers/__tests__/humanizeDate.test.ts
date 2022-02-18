/**
 * @jest-environment jsdom
 */

import { humanizeDate } from '../humanizeDate'

describe('app/helpers/humanizeDate()', () => {
  test(`with a valid Date`, () => {
    const date = new Date()

    const result = humanizeDate(date)

    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  test(`with a valid ISO date`, () => {
    const date = new Date().toISOString()

    const result = humanizeDate(date)

    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  test(`with an invalid ISO date`, () => {
    const date = '28/01/2022'

    const result = humanizeDate(date)

    expect(result).toEqual('Invalid Date')
  })

  test(`with undefined`, () => {
    const date = undefined

    const result = humanizeDate(date as any)

    expect(result).toEqual('')
  })
})
