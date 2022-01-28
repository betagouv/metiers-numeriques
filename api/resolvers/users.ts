import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Prisma, User } from '@prisma/client'

export const mutation = {
  deleteUser: async (_parent: undefined, { id }: { id: string }): Promise<User | null> => {
    try {
      const args: Prisma.UserDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().user.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.deleteUser()')

      return null
    }
  },

  updateUser: async (_parent: undefined, { id, input }: { id: string; input: User }): Promise<User | null> => {
    try {
      const args: Prisma.UserUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().user.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.updateUser()')

      return null
    }
  },
}

export const query = {
  getUser: async (_parent: undefined, { id }: { id: string }): Promise<User | null> => {
    try {
      const args: Prisma.UserFindUniqueArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().user.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.getUser()')

      return null
    }
  },

  getUsers: async (_parent: undefined, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<User>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['email', 'firstName', 'lastName'], query)

      const args: Prisma.UserFindManyArgs = {
        orderBy: {
          lastName: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().user.count(whereFilter)
      const data = await getPrisma().user.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.getUsers()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
