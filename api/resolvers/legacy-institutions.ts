import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { getPrisma } from '@api/helpers/getPrisma'
import { handleError } from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { LegacyInstitution } from '@prisma/client'

export const mutation = {
  createLegacyInstitution: (obj, { input }: { input: LegacyInstitution }) => {
    try {
      return getPrisma().legacyInstitution.create({
        data: input,
      })
    } catch (err) {
      handleError(err, 'pages/api/graphql.ts > resolvers.createLegacyInstitution()')
    }
  },
  deleteLegacyInstitution: (obj, { id }: { id: string }) =>
    getPrisma().legacyInstitution.delete({
      where: {
        id,
      },
    }),

  updateLegacyInstitution: (obj, { id, input }: { id: string; input: Partial<LegacyInstitution> }) =>
    getPrisma().legacyInstitution.update({
      data: input as any,
      where: {
        id,
      },
    }),
}

export const query = {
  getLegacyInstitution: async (
    obj,
    { id, slug }: { id: string; slug: undefined } | { id: undefined; slug: string },
  ) => {
    const where =
      id !== undefined
        ? {
            id,
          }
        : {
            slug,
          }

    const legacyInstitution = await getPrisma().legacyInstitution.findUnique({
      include: {
        files: {
          include: {
            file: true,
          },
        },
        logoFile: true,
        thumbnailFile: true,
      },
      where,
    })

    return legacyInstitution
  },

  getLegacyInstitutions: async (
    obj,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<LegacyInstitution>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter(['fullName', 'title'], query)

      const args = {
        include: {
          logoFile: true,
          thumbnailFile: true,
        },
        orderBy: {
          title: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().legacyInstitution.count(whereFilter)
      const data = await getPrisma().legacyInstitution.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-institutions.ts > query.getLegacyInstitutions()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
