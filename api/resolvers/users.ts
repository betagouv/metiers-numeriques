import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { User } from '@prisma/client'

export const mutation = {
  deleteUser: (obj, { id }: { id: string }) =>
    getPrisma().user.delete({
      where: {
        id,
      },
    }),

  updateUser: (obj, { id, input }: { id: string; input: User }) =>
    getPrisma().user.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getUser: (obj, { id }: { id: string }) =>
    getPrisma().user.findUnique({
      where: {
        id,
      },
    }),

  getUsers: async (obj, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<User>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['email', 'firstName', 'lastName'], query)

      const args = {
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
      handleError(err, 'api/resolvers/legacy-entities.ts > query.getLegacyEntities()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
