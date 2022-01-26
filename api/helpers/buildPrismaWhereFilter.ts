import { define } from '@common/helpers/define'
import handleError from '@common/helpers/handleError'
import * as R from 'ramda'

const buildNativeStatements = (fields: string[], searchQuery: string) =>
  R.pipe(
    R.reject(R.test(/\./)),
    R.map(nativeFields => ({
      [nativeFields]: {
        contains: searchQuery,
        mode: 'insensitive',
      },
    })),
  )(fields)

const buildRelationStatements = (fields: string[], searchQuery: string) =>
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

export default function buildPrismaWhereFilter(
  fields: string[],
  searchQuery?: string,
  additionalFilter?: Record<string, Common.Pojo>,
): any {
  try {
    const definedSearchQuery = define(searchQuery)
    const definedAddtionalFilter = define(additionalFilter)

    if (definedSearchQuery === undefined && definedAddtionalFilter === undefined) {
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

    if (definedAddtionalFilter !== undefined) {
      whereFilter.where.AND = additionalFilter
    }

    return whereFilter
  } catch (err) {
    handleError(err, 'api/helpers/buildPrismaPaginationFilter()')

    return {}
  }
}
