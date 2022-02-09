import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Address, Contact, Job, Prisma, Profession, Recruiter } from '@prisma/client'

export type JobFromGetOne = Job & {
  address: Address
  applicationContacts: Contact[]
  infoContact: Contact
  profession: Profession
  recruiter: Recruiter
}

export type JobFromGetJobs = JobFromGetPublicJobs

export type JobFromGetPublicJobs = Job & {
  address: Address
  applicationContacts: Contact[]
  infoContact: Contact
  profession: Profession
  recruiter: Recruiter
}

const PUBLIC_PER_PAGE_THROTTLE = 12

export const mutation = {
  createJob: async (
    _parent: undefined,
    {
      input: { applicationContactIds = [], ...input },
    }: {
      input: Prisma.JobCreateInput & {
        applicationContactIds?: string[]
      }
    },
  ): Promise<Job | null> => {
    try {
      const applicationContactsAsConnections = applicationContactIds.map(id => ({
        id,
      }))
      const controlledInput: Prisma.JobCreateInput = {
        ...input,
        updatedAt: dayjs().toDate(),
      }

      const args: Prisma.JobCreateArgs = {
        data: controlledInput,
      }

      const data = await getPrisma().job.create(args)

      await getPrisma().job.update({
        data: {
          applicationContacts: {
            connect: applicationContactsAsConnections,
          },
        },
        where: {
          id: data.id,
        },
      })

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

  updateJob: async (
    _parent: undefined,
    {
      id,
      input: { applicationContactIds = [], ...input },
    }: {
      id: string
      input: Prisma.JobUpdateInput & {
        applicationContactIds?: string[]
      }
    },
  ): Promise<Job | null> => {
    try {
      await getPrisma().job.update({
        data: {
          applicationContacts: {
            set: [],
          },
        },
        where: {
          id,
        },
      })

      const args: Prisma.JobUpdateArgs = {
        data: input,
        include: {
          applicationContacts: true,
        },
        where: {
          id,
        },
      }

      const data = await getPrisma().job.update(args)

      await getPrisma().job.update({
        data: {
          applicationContacts: {
            set: [],
          },
        },
        where: {
          id,
        },
      })
      const applicationContactsAsConnections = applicationContactIds.map(id => ({
        id,
      }))
      await getPrisma().job.update({
        data: {
          applicationContacts: {
            connect: applicationContactsAsConnections,
          },
        },
        include: {
          applicationContacts: true,
        },
        where: {
          id,
        },
      })

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.updateJob()')

      return null
    }
  },
}

export const query = {
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const args: Prisma.JobFindManyArgs = {
        orderBy: {
          updatedAt: 'desc',
        },
      }

      const data = await getPrisma().job.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/jobs.ts > query.getAllJobs()')

      return []
    }
  },

  getJob: async (_parent: undefined, { id }: { id: string }): Promise<JobFromGetOne | null> => {
    try {
      const args: Prisma.JobFindUniqueArgs = {
        include: {
          address: true,
          applicationContacts: true,
          infoContact: true,
          profession: true,
          recruiter: true,
        },
        where: {
          id,
        },
      }

      const data = (await getPrisma().job.findUnique(args)) as unknown as JobFromGetOne | null

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
  ): Promise<GetAllResponse<JobFromGetJobs>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Record<string, Common.Pojo> = {}
      if (state !== undefined) {
        andFilter.state = state
      }
      const whereFilter = buildPrismaWhereFilter<JobFromGetJobs>(['title'], query, andFilter)

      const args: Prisma.JobFindManyArgs = {
        include: {
          address: true,
          applicationContacts: true,
          infoContact: true,
          profession: true,
          recruiter: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().job.count(whereFilter)
      const data = (await getPrisma().job.findMany(args)) as unknown as JobFromGetJobs[]
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

  getPublicJobs: async (
    obj,
    {
      pageIndex,
      perPage,
      query,
      region,
    }: GetAllArgs & {
      region?: string
    },
  ): Promise<GetAllResponse<JobFromGetPublicJobs>> => {
    try {
      const throttledPerPage = perPage <= PUBLIC_PER_PAGE_THROTTLE ? perPage : 1

      const paginationFilter = buildPrismaPaginationFilter(throttledPerPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.JobWhereInput> = {
        state: JobState.PUBLISHED,
      }
      if (region !== undefined) {
        andFilter.address = { region }
      }
      const whereFilter = buildPrismaWhereFilter<JobFromGetPublicJobs>(['title'], query, andFilter)

      const args = {
        include: {
          address: true,
          applicationContacts: true,
          infoContact: true,
          profession: true,
          recruiter: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().job.count(whereFilter)
      const data = (await getPrisma().job.findMany(args)) as unknown as JobFromGetPublicJobs[]
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
