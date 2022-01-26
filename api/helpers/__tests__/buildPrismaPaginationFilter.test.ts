/**
 * @jest-environment jsdom
 */

import buildPrismaPaginationFilter from '../buildPrismaPaginationFilter'

describe('api/helpers/buildPrismaPaginationFilter()', () => {
  test(`with 1`, () => {
    const perPage = 1

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })

  test(`with 20`, () => {
    const perPage = 20

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 20,
    })
  })

  test(`with 21`, () => {
    const perPage = 1

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })

  test(`with Infinity`, () => {
    const perPage = Infinity

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })

  test(`with 1.2`, () => {
    const perPage = 1.2

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })

  test(`with 0`, () => {
    const perPage = 0

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })

  test(`with 10 and 0`, () => {
    const perPage = 10
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 10,
    })
  })

  test(`with 10 and 1`, () => {
    const perPage = 10
    const pageIndex = 1

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 10,
      take: 10,
    })
  })

  test(`with 10 and Infinity`, () => {
    const perPage = 10
    const pageIndex = Infinity

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 10,
    })
  })

  test(`with 10 and -1`, () => {
    const perPage = 10
    const pageIndex = -1

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 10,
    })
  })

  test(`with a wrong input`, () => {
    const perPage = 'whatever' as any

    const result = buildPrismaPaginationFilter(perPage)

    expect(result).toStrictEqual({
      take: 1,
    })
  })
})
