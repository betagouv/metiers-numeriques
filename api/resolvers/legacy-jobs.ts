import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaSearchFilter from '@api/helpers/buildPrismaSearchFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'
import { JobSource, LegacyJob } from '@prisma/client'
import * as R from 'ramda'

type GetAllArgs = {
  fromId?: string
  pageLength?: number
  query?: string
}

export const mutation = {
  createLegacyJob: async (obj, { input }: { input: LegacyJob }) => {
    try {
      const result = await getPrisma().legacyJob.create({
        data: input,
      })

      return result
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > mutation.createLegacyJob()')

      return {}
    }
  },

  deleteLegacyJob: async (obj, { id }: { id: string }) => {
    try {
      const result = await getPrisma().legacyJob.delete({
        where: {
          id,
        },
      })

      return result
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > mutation.deleteLegacyJob()')

      return {}
    }
  },

  updateLegacyJob: async (obj, { id, input }: { id: string; input: Partial<LegacyJob> }) => {
    try {
      const result = await getPrisma().legacyJob.update({
        data: input,
        where: {
          id,
        },
      })

      return result
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > mutation.updateLegacyJob()')

      return {}
    }
  },
}

export const query = {
  getLegacyJob: async (obj, { id, slug }: { id: string; slug: undefined } | { id: undefined; slug: string }) => {
    try {
      const where =
        id !== undefined
          ? {
              id,
            }
          : {
              slug,
            }

      const result = await getPrisma().legacyJob.findUnique({
        include: {
          legacyService: {
            include: {
              legacyEntity: true,
            },
          },
        },
        where,
      })

      return result
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > query.getLegacyJob()')

      return {}
    }
  },

  getLegacyJobs: async (obj, { fromId, pageLength, query }: GetAllArgs) => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(pageLength, fromId)
      const maybeSearchFilter = buildPrismaSearchFilter(['title'], query)
      const searchFilter = R.isEmpty(maybeSearchFilter)
        ? {
            where: {
              source: JobSource.MNN,
            },
          }
        : maybeSearchFilter

      const result = await getPrisma().legacyJob.findMany({
        include: {
          legacyService: {
            include: {
              legacyEntity: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...searchFilter,
      })

      return result
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > query.getLegacyJobs()')

      return {}
    }
  },
}
