import { handleError } from '@common/helpers/handleError'

import { buildPrismaPaginationFilter } from '../helpers/buildPrismaPaginationFilter'
import { buildPrismaWhereFilter } from '../helpers/buildPrismaWhereFilter'
import { prisma } from '../libs/prisma'

import type { GetAllArgs, GetAllResponse } from './types'
import type { ArchivedJob, Prisma } from '@prisma/client'

export const mutation = {
  createArchivedJob: async (
    _parent: undefined,
    { input }: { input: Prisma.ArchivedJobCreateInput },
  ): Promise<ArchivedJob | null> => {
    try {
      const args: Prisma.ArchivedJobCreateArgs = {
        data: input,
      }

      const newData = await prisma.archivedJob.create(args)

      return newData
    } catch (err) {
      handleError(err, 'api/resolvers/archived-jobs.ts > query.createArchivedJob()')

      return null
    }
  },

  deleteArchivedJob: async (_parent: undefined, { id }: { id: string }): Promise<ArchivedJob | null> => {
    try {
      const args: Prisma.ArchivedJobDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await prisma.archivedJob.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/archived-jobs.ts > query.deleteArchivedJob()')

      return null
    }
  },

  updateArchivedJob: async (
    _parent: undefined,
    { id, input }: { id: string; input: Partial<ArchivedJob> },
  ): Promise<ArchivedJob | null> => {
    try {
      const args: Prisma.ArchivedJobUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await prisma.archivedJob.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/archived-jobs.ts > query.updateArchivedJob()')

      return null
    }
  },
}

export const query = {
  getArchivedJob: async (_parent: undefined, { id }: { id: string }): Promise<ArchivedJob | null> => {
    try {
      const args: Prisma.ArchivedJobFindUniqueArgs = {
        include: {
          profession: true,
        },
        where: {
          id,
        },
      }

      const data = await prisma.archivedJob.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/archived-jobs.ts > query.getArchivedJob()')

      return null
    }
  },

  getArchivedJobs: async (
    _parent: undefined,
    {
      pageIndex,
      perPage,
      query,
      region,
      source,
    }: GetAllArgs & {
      region?: string
      source?: string
    },
  ): Promise<GetAllResponse<ArchivedJob>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Record<string, Common.Pojo> = {}
      if (region !== undefined) {
        andFilter.region = region
      }
      if (source !== undefined) {
        andFilter.source = source
      }
      const whereFilter = buildPrismaWhereFilter(['title'], query, andFilter)

      const args: Prisma.ArchivedJobFindManyArgs = {
        include: {
          profession: true,
        },
        orderBy: {
          expiredAt: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await prisma.archivedJob.count(whereFilter)
      const data = await prisma.archivedJob.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/archived-jobs.ts > query.getArchivedJobs()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
