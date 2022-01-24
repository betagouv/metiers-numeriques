/**
 * @jest-environment jsdom
 */

import humanizeDate from '../humanizeDate'

describe('app/helpers/humanizeDate()', () => {
  test(`with a valid ISO date`, () => {
    const date = new Date().toISOString()

    const result = humanizeDate(date)

    expect(result.length).toBeGreaterThan(0)
  })

  test(`with "An invalid ISO date"`, () => {
    const date = 'An invalid ISO date'

    const result = humanizeDate(date)

    expect(result).toEqual('')
  })

  test(`with undefined`, () => {
    const date = undefined

    const result = humanizeDate(date as any)

    expect(result).toEqual('')
  })
})
