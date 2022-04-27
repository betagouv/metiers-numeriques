import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { LegacyService, Prisma } from '@prisma/client'

export const mutation = {
  createLegacyService: (obj, { input }: { input: LegacyService }) =>
    prisma.legacyService.create({
      data: input,
    }),

  deleteLegacyService: (obj, { id }: { id: string }) =>
    prisma.legacyService.delete({
      where: {
        id,
      },
    }),

  updateLegacyService: (obj, { id, input }: { id: string; input: Partial<LegacyService> }) =>
    prisma.legacyService.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getLegacyService: (obj, { id }: { id: string }) =>
    prisma.legacyService.findUnique({
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

      const length = await prisma.legacyService.count(whereFilter)
      const data = await prisma.legacyService.findMany(args)
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

  getLegacyServicesList: async (): Promise<LegacyService[]> => {
    try {
      const args: Prisma.LegacyServiceFindManyArgs = {
        include: {
          legacyEntity: true,
        },
        orderBy: {
          name: 'asc',
        },
      }

      const data = await prisma.legacyService.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-services.ts > query.getLegacyServicesList()')

      return []
    }
  },
}
