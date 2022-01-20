import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaSearchFilter from '@api/helpers/buildPrismaSearchFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { LegacyInstitution } from '@prisma/client'

type GetAllArgs = {
  fromId?: string
  pageLength?: number
  query?: string
}

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

  getLegacyInstitutions: (obj, { fromId, pageLength, query }: GetAllArgs) => {
    const paginationFilter = buildPrismaPaginationFilter(pageLength, fromId)
    const searchFilter = buildPrismaSearchFilter(['fullName', 'title'], query)

    return getPrisma().legacyInstitution.findMany({
      include: {
        logoFile: true,
        thumbnailFile: true,
      },
      orderBy: {
        title: 'asc',
      },
      ...paginationFilter,
      ...searchFilter,
    })
  },
}
