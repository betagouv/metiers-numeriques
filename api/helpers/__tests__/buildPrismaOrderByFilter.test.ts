/**
 * @jest-environment node
 */

import { buildPrismaOrderByFilter } from '../buildPrismaOrderByFilter'

describe('api/helpers/buildPrismaOrderByFilter()', () => {
  test(`with undefined`, () => {
    const defaultOrderBy = ['aColumn', 'asc']

    const result = buildPrismaOrderByFilter(defaultOrderBy as any)

    expect(result).toStrictEqual({
      orderBy: {
        aColumn: 'asc',
      },
    })
  })

  test(`with ["anotherColumn", "desc"]`, () => {
    const defaultOrderBy = ['aColumn', 'asc']
    const orderBy = ['anotherColumn', 'desc']

    const result = buildPrismaOrderByFilter(defaultOrderBy as any, orderBy as any)

    expect(result).toStrictEqual({
      orderBy: {
        anotherColumn: 'desc',
      },
    })
  })
})
