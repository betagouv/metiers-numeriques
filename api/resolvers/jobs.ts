import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Job, JobState, Prisma } from '@prisma/client'

export const mutation = {
  createJob: async (_parent: undefined, { input }: { input: Prisma.JobCreateInput }): Promise<Job | null> => {
    try {
      const inputWithUpdatedAt: Prisma.JobCreateInput = {
        ...input,
        updatedAt: dayjs().toDate(),
      }

      const args: Prisma.JobCreateArgs = {
        data: inputWithUpdatedAt,
      }

      const data = await getPrisma().job.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.createJob()')

      return null
    }
  },

  deleteJob: async (_parent: undefined, { id }: { id: string }): Promise<Job | null> => {
    try {
      const args: Prisma.JobDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().job.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.deleteJob()')

      return null
    }
  },

  updateJob: async (_parent: undefined, { id, input }: { id: string; input: Partial<Job> }): Promise<Job | null> => {
    try {
      const args: Prisma.JobUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().job.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.updateJob()')

      return null
    }
  },
}

export const query = {
  getJob: async (_parent: undefined, { id }: { id: string }): Promise<Job | null> => {
    try {
      const args: Prisma.JobFindUniqueArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().job.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.getJob()')

      return null
    }
  },

  getJobs: async (
    _parent: undefined,
    {
      pageIndex,
      perPage,
      query,
      state,
    }: GetAllArgs & {
      state?: JobState
    },
  ): Promise<GetAllResponse<Job>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Record<string, Common.Pojo> = {}
      if (state !== undefined) {
        andFilter.state = state
      }
      const whereFilter = buildPrismaWhereFilter<Job>(['title'], query, andFilter)

      const args: Prisma.JobFindManyArgs = {
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().job.count(whereFilter)
      const data = await getPrisma().job.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.getJobs()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getJobsList: async (): Promise<Job[]> => {
    try {
      const args: Prisma.JobFindManyArgs = {
        orderBy: {
          updatedAt: 'desc',
        },
      }

      const data = await getPrisma().job.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.getJobsList()')

      return []
    }
  },
}
