import { define } from '@common/helpers/define'
import { handleError } from '@common/helpers/handleError'
import * as R from 'ramda'

const buildNativeStatements = <T extends Record<string, any>>(fields: Array<keyof T>, searchQuery: string) =>
  R.pipe(
    R.reject(R.test(/\./)),
    R.map(nativeFields => ({
      [nativeFields]: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    })),
  )(fields)

const buildRelationStatements = <T extends Record<string, any>>(fields: Array<keyof T>, searchQuery: string) =>
  R.pipe(
    R.filter(R.test(/\./)),
    R.map(R.split('.')),
    R.map(([relationField, foreignField]) => ({
      [relationField]: {
        [foreignField]: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
    })),
  )(fields)

export function buildPrismaWhereFilter<T extends Record<string, any>>(
  fields: Array<keyof T>,
  searchQuery?: string,
  andFilter?: Record<string, Common.Pojo>,
  notFilter?: Record<string, Common.Pojo>,
): any {
  try {
    const definedSearchQuery = define(searchQuery)
    const definedAndFilter = define(andFilter)
    const definedNotFilter = define(notFilter)

    if (definedSearchQuery === undefined && definedAndFilter === undefined) {
      return {}
    }

    const whereFilter: any = {
      where: {},
    }

    if (definedSearchQuery !== undefined) {
      const nativeStatements = buildNativeStatements(fields, definedSearchQuery)
      const relationStatements = buildRelationStatements(fields, definedSearchQuery)

      whereFilter.where.OR = [...nativeStatements, ...relationStatements]
    }

    if (definedAndFilter !== undefined) {
      whereFilter.where.AND = definedAndFilter
    }

    if (definedNotFilter !== undefined) {
      whereFilter.where.NOT = definedNotFilter
    }

    return whereFilter
  } catch (err) {
    handleError(err, 'api/helpers/buildPrismaPaginationFilter()')

    return {}
  }
}
