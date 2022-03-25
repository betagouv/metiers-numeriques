import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'
import { JobState, UserRole } from '@prisma/client'
import dayjs from 'dayjs'

import type { Context, GetAllArgs, GetAllResponse } from './types'
import type { Region } from '@common/constants'
import type {
  Address,
  Contact,
  Institution,
  Job,
  JobContractType,
  JobRemoteStatus,
  Prisma,
  Profession,
  Recruiter,
} from '@prisma/client'

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
  recruiter: Recruiter & {
    institution: Institution
  }
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

      const updatedAt = input.updatedAt || dayjs().toDate()
      const controlledInput: Prisma.JobCreateInput = {
        ...input,
        updatedAt,
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
    context: Context,
  ): Promise<GetAllResponse<JobFromGetJobs>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.JobWhereInput> = {}
      if (context.user.role === UserRole.RECRUITER) {
        const { recruiterId } = context.user
        const institution = await getPrisma().institution.findFirst({
          include: {
            recruiters: true,
          },
          where: {
            recruiters: {
              some: {
                id: recruiterId,
              },
            },
          },
        })
        if (institution === null) {
          throw new Error(`Recruiter not found (id: ${recruiterId}).`)
        }

        const recruiterIds = institution.recruiters.map(recruiter => recruiter.id)
        andFilter.recruiterId = {
          in: recruiterIds,
        }
      }
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
    queryArgs: GetAllArgs & {
      contractTypes?: JobContractType[]
      institutionIds?: string[]
      professionId?: string
      region?: Region
      remoteStatuses?: JobRemoteStatus[]
    },
  ): Promise<GetAllResponse<JobFromGetPublicJobs>> => {
    try {
      const { contractTypes, institutionIds, pageIndex, perPage, professionId, query, region, remoteStatuses } =
        queryArgs

      const throttledPerPage = perPage <= PUBLIC_PER_PAGE_THROTTLE ? perPage : 1

      const paginationFilter = buildPrismaPaginationFilter(throttledPerPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.JobWhereInput> = {
        expiredAt: {
          gt: new Date(),
        },
        state: JobState.PUBLISHED,
      }
      if (contractTypes !== undefined && contractTypes.length > 0) {
        andFilter.contractTypes = {
          hasSome: contractTypes,
        }
      }
      if (institutionIds !== undefined && institutionIds.length > 0) {
        andFilter.recruiter = {
          institution: {
            id: {
              in: institutionIds,
            },
          },
        }
      }
      if (professionId !== undefined) {
        andFilter.professionId = professionId
      }
      if (region !== undefined) {
        andFilter.address = { region }
      }
      if (remoteStatuses !== undefined && remoteStatuses.length > 0) {
        andFilter.remoteStatus = {
          in: remoteStatuses,
        }
      }
      const whereFilter = buildPrismaWhereFilter<JobFromGetPublicJobs>(['title'], query, andFilter)

      const args = {
        include: {
          address: true,
          applicationContacts: true,
          infoContact: true,
          profession: true,
          recruiter: {
            include: {
              institution: true,
            },
          },
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
      handleError(err, 'api/resolvers/jobs.ts > query.getPublicJobs()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
