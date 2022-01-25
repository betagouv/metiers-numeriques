import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { File } from '@prisma/client'

export const mutation = {
  createFile: (obj, { input }: { input: File }) =>
    getPrisma().file.create({
      data: input,
    }),

  deleteFile: (obj, { id }: { id: string }) =>
    getPrisma().file.delete({
      where: {
        id,
      },
    }),

  updateFile: (obj, { id, input }: { id: string; input: Partial<File> }) =>
    getPrisma().file.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getFile: (obj, { id }: { id: string }) =>
    getPrisma().file.findUnique({
      where: {
        id,
      },
    }),

  getFiles: async (obj, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<File>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['title', 'url'], query)

      const args = {
        orderBy: {
          title: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().file.count(whereFilter)
      const data = await getPrisma().file.findMany(args)
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
