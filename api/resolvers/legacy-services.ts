import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { LegacyService } from '@prisma/client'

export const mutation = {
  createLegacyService: (obj, { input }: { input: LegacyService }) =>
    getPrisma().legacyService.create({
      data: input,
    }),

  deleteLegacyService: (obj, { id }: { id: string }) =>
    getPrisma().legacyService.delete({
      where: {
        id,
      },
    }),

  updateLegacyService: (obj, { id, input }: { id: string; input: Partial<LegacyService> }) =>
    getPrisma().legacyService.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getLegacyService: (obj, { id }: { id: string }) =>
    getPrisma().legacyService.findUnique({
      include: {
        legacyEntity: true,
      },
      where: {
        id,
      },
    }),

  getLegacyServices: async (obj, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<LegacyService>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['fullName', 'name'], query)

      const args = {
        include: {
          legacyEntity: true,
        },
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().legacyService.count(whereFilter)
      const data = await getPrisma().legacyService.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-services.ts > query.getLegacyServices()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
