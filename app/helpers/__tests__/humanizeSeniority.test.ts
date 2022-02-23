/**
 * @jest-environment jsdom
 */

import { humanizeSeniority } from '../humanizeSeniority'

describe('app/helpers/humanizeSeniority()', () => {
  test(`with 0 month`, () => {
    const seniorityInMonths = 0

    const result = humanizeSeniority(seniorityInMonths)

    expect(result).toBe('Ouvert aux débutant·es')
  })

  test(`with 12 months`, () => {
    const seniorityInMonths = 12

    const result = humanizeSeniority(seniorityInMonths)

    expect(result).toMatch('1 an')
  })

  test(`with 24 months`, () => {
    const seniorityInMonths = 24

    const result = humanizeSeniority(seniorityInMonths)

    expect(result).toEqual('2 ans')
  })
})
