/**
 * @jest-environment jsdom
 */

import { normalizeDateForDateInput } from '../normalizeDateForDateInput'

describe('app/helpers/normalizeDateForDateInput()', () => {
  test(`with a valid ISO date`, () => {
    const isoDate = new Date().toISOString()

    const result = normalizeDateForDateInput(isoDate)

    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  test(`with an invalid ISO date`, () => {
    const isoDate = 'Whatever'

    const result = normalizeDateForDateInput(isoDate)

    expect(result).toBeNull()
  })

  test(`with null`, () => {
    const isoDate = null

    const result = normalizeDateForDateInput(isoDate)

    expect(result).toBeNull()
  })
})
