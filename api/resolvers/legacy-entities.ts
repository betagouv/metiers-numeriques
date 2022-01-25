import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { LegacyEntity } from '@prisma/client'

export const mutation = {
  createLegacyEntity: (obj, { input }: { input: LegacyEntity }) =>
    getPrisma().legacyEntity.create({
      data: input,
    }),

  deleteLegacyEntity: (obj, { id }: { id: string }) =>
    getPrisma().legacyEntity.delete({
      where: {
        id,
      },
    }),

  updateLegacyEntity: (obj, { id, input }: { id: string; input: Partial<LegacyEntity> }) =>
    getPrisma().legacyEntity.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getLegacyEntities: async (obj, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<LegacyEntity>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['fullName', 'name'], query)

      const args = {
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().legacyEntity.count(whereFilter)
      const data = await getPrisma().legacyEntity.findMany(args)
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

  getLegacyEntity: (obj, { id }: { id: string }) =>
    getPrisma().legacyEntity.findUnique({
      where: {
        id,
      },
    }),
}
