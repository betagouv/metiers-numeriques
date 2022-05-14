import { handleError } from '@common/helpers/handleError'

export function buildPrismaOrderByFilter<T = Record<string, any>>(
  defaultOrderBy: [keyof T, 'asc' | 'desc'],
  orderBy?: [keyof T, 'asc' | 'desc'],
):
  | {
      orderBy: {
        [key in keyof T]?: 'asc' | 'desc'
      }
    }
  | {} {
  try {
    if (orderBy === undefined) {
      return {
        orderBy: {
          [defaultOrderBy[0] as keyof T]: defaultOrderBy[1],
        },
      } as {
        orderBy: {
          [key in keyof T]: 'asc' | 'desc'
        }
      }
    }

    return {
      orderBy: {
        [orderBy[0]]: orderBy[1],
      },
    } as {
      orderBy: {
        [key in keyof T]: 'asc' | 'desc'
      }
    }
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'api/helpers/buildPrismaPaginationFilter()')

    return {}
  }
}
