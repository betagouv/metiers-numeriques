import buildPrismaWhereFilter from '../buildPrismaWhereFilter'

describe('api/helpers/buildPrismaWhereFilter()', () => {
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
    const additionalFilter = {
      d: 'bar',
    }

    const result = buildPrismaWhereFilter(fields, searchQuery, additionalFilter)

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

  test(`with ["a", "b.c"]`, () => {
    const fields = ['a', 'b.c']

    const result = buildPrismaWhereFilter(fields)

    expect(result).toStrictEqual({})
  })
})
