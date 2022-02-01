/**
 * @jest-environment jsdom
 */

import { normalizeDate } from '../normalizeDate'

describe('app/helpers/normalizeDate()', () => {
  test(`with a valid Date`, () => {
    const date = new Date()

    const result = normalizeDate(date)

    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  test(`with a valid ISO date`, () => {
    const date = new Date().toISOString()

    const result = normalizeDate(date)

    expect(result).toMatch(/^\d{2}\/\d{2}\/\d{4}$/)
  })

  test(`with undefined`, () => {
    const date = undefined

    const result = normalizeDate(date as any)

    expect(result).toEqual('')
  })
})
