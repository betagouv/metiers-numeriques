import buildPrismaWhereFilter from '../buildPrismaWhereFilter'

describe('api/helpers/buildPrismaWhereFilter()', () => {
  test(`with ["a", "b.c"]`, () => {
    const fields = ['a', 'b.c']

    const result = buildPrismaWhereFilter(fields)

    expect(result).toStrictEqual({})
  })

  test(`with ["a", "b.c"] and "foo"`, () => {
    const fields = ['a', 'b.c']
    const searchQuery = 'foo'

    const result = buildPrismaWhereFilter(fields, searchQuery)

    expect(result).toStrictEqual({
      where: {
        OR: [
          {
            a: {
              contains: 'foo',
              mode: 'insensitive',
            },
          },
          {
            b: {
              c: {
                contains: 'foo',
                mode: 'insensitive',
              },
            },
          },
        ],
      },
    })
  })

  test(`with ["a", "b.c"], "foo" and { d: "bar" }`, () => {
    const fields = ['a', 'b.c']
    const searchQuery = 'foo'
    const andFilter = {
      d: 'bar',
    }

    const result = buildPrismaWhereFilter(fields, searchQuery, andFilter)

    expect(result).toStrictEqual({
      where: {
        AND: {
          d: 'bar',
        },
        OR: [
          {
            a: {
              contains: 'foo',
              mode: 'insensitive',
            },
          },
          {
            b: {
              c: {
                contains: 'foo',
                mode: 'insensitive',
              },
            },
          },
        ],
      },
    })
  })

  test(`with ["a", "b.c"], "foo", { d: "bar" } and { e: "wow" }`, () => {
    const fields = ['a', 'b.c']
    const searchQuery = 'foo'
    const andFilter = {
      d: 'bar',
    }
    const notFilter = {
      e: 'wow',
    }

    const result = buildPrismaWhereFilter(fields, searchQuery, andFilter, notFilter)

    expect(result).toStrictEqual({
      where: {
        AND: {
          d: 'bar',
        },
        NOT: {
          e: 'wow',
        },
        OR: [
          {
            a: {
              contains: 'foo',
              mode: 'insensitive',
            },
          },
          {
            b: {
              c: {
                contains: 'foo',
                mode: 'insensitive',
              },
            },
          },
        ],
      },
    })
  })
})
