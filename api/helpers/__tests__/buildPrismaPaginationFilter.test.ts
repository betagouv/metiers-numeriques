/**
 * @jest-environment node
 */

import { buildPrismaPaginationFilter } from '../buildPrismaPaginationFilter'

describe('api/helpers/buildPrismaPaginationFilter()', () => {
  test(`with 1 and 0`, () => {
    const perPage = 1
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 1,
    })
  })

  test(`with 100 and 0`, () => {
    const perPage = 100
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 100,
    })
  })

  test(`with 101 and 0`, () => {
    const perPage = 1
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 1,
    })
  })

  test(`with Infinity and 0`, () => {
    const perPage = Infinity
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 1,
    })
  })

  test(`with 1.2 and 0`, () => {
    const perPage = 1.2
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 1,
    })
  })

  test(`with 0 and 0`, () => {
    const perPage = 0
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
      take: 1,
    })
  })

  test(`with a wrong <perPage> type`, () => {
    const perPage = 'whatever' as any
    const pageIndex = 0

    const result = buildPrismaPaginationFilter(perPage, pageIndex)

    expect(result).toStrictEqual({
      skip: 0,
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
})
