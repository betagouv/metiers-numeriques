/**
 * @jest-environment jsdom
 */

import normalizeDate from '../normalizeDate'

describe('app/helpers/normalizeDate()', () => {
  test(`with a valid Date`, () => {
    const date = new Date()

    const result = normalizeDate(date)

    expect(result).toHaveLength(10)
  })

  test(`with undefined`, () => {
    const date = undefined

    const result = normalizeDate(date as any)

    expect(result).toEqual('')
  })
})
