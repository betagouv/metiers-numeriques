import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'

import type { GetAllArgs, GetAllResponse } from './types'
import type { LegacyJob, Prisma } from '@prisma/client'

const PUBLIC_PER_PAGE_THROTTLE = 12

export const mutation = {
  createLegacyJob: async (obj, { input }: { input: LegacyJob }) => {
    try {
      const result = await prisma.legacyJob.create({
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
      const result = await prisma.legacyJob.delete({
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
      const result = await prisma.legacyJob.update({
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
  getAllLegacyJobs: async (): Promise<LegacyJob[]> => {
    try {
      const args: Prisma.LegacyJobFindManyArgs = {
        orderBy: {
          updatedAt: 'desc',
        },
      }

      const data = await prisma.legacyJob.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > query.getAllLegacyJobs()')

      return []
    }
  },

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

      const result = await prisma.legacyJob.findUnique({
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

  getLegacyJobs: async (
    obj,
    {
      pageIndex,
      perPage,
      query,
      region,
      source,
      state,
    }: GetAllArgs & {
      region?: string
      source?: string
      state?: string
    },
  ): Promise<GetAllResponse<LegacyJob>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Record<string, Common.Pojo> = {
        isMigrated: false,
      }
      if (region !== undefined) {
        andFilter.legacyService = { region }
      }
      if (source !== undefined) {
        andFilter.source = source
      }
      if (state !== undefined) {
        andFilter.state = state
      }
      const whereFilter = buildPrismaWhereFilter(['title'], query, andFilter)

      const args = {
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
        ...whereFilter,
      }

      const length = await prisma.legacyJob.count(whereFilter)
      const data = await prisma.legacyJob.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > query.getLegacyJobs()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getPublicLegacyJobs: async (
    obj,
    {
      pageIndex,
      perPage,
      query,
      region,
    }: GetAllArgs & {
      region?: string
    },
  ): Promise<GetAllResponse<LegacyJob>> => {
    try {
      const throttledPerPage = perPage <= PUBLIC_PER_PAGE_THROTTLE ? perPage : 1

      const paginationFilter = buildPrismaPaginationFilter(throttledPerPage, pageIndex)

      const andFilter: Record<string, Common.Pojo> = {
        isMigrated: false,
        limitDate: {
          gt: new Date(),
        },
        state: JobState.PUBLISHED,
      }
      if (region !== undefined) {
        andFilter.legacyService = { region }
      }

      const whereFilter = buildPrismaWhereFilter(['title'], query, andFilter)

      const args = {
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
        ...whereFilter,
      }

      const length = await prisma.legacyJob.count(whereFilter)
      const data = await prisma.legacyJob.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > query.getLegacyJobs()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
