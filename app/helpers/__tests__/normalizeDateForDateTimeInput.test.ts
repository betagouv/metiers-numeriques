/**
 * @jest-environment jsdom
 */

import { normalizeDateForDateTimeInput } from '../normalizeDateForDateTimeInput'

describe('app/helpers/normalizeDateForDateTimeInput()', () => {
  test(`with a valid ISO date`, () => {
    const isoDate = new Date().toISOString()

    const result = normalizeDateForDateTimeInput(isoDate)

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  test(`with an invalid ISO date`, () => {
    const isoDate = 'Whatever'

    const result = normalizeDateForDateTimeInput(isoDate)

    expect(result).toBeNull()
  })

  test(`with null`, () => {
    const isoDate = null

    const result = normalizeDateForDateTimeInput(isoDate)

    expect(result).toBeNull()
  })
})
