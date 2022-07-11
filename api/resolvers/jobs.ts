import { handleError } from '@common/helpers/handleError'
import { Domain, JobState, UserRole } from '@prisma/client'
import dayjs from 'dayjs'

import { buildPrismaPaginationFilter } from '../helpers/buildPrismaPaginationFilter'
import { buildPrismaWhereFilter } from '../helpers/buildPrismaWhereFilter'
import { prisma } from '../libs/prisma'

import type { Context, GetAllArgs, GetAllResponse } from './types'
import type { Region } from '@common/constants'
import type {
  Address,
  Contact,
  Institution,
  Job,
  JobContractType,
  JobRemoteStatus,
  JobSource,
  Prisma,
  Profession,
  Recruiter,
} from '@prisma/client'

export type JobFromGetOne = Job & {
  address: Address
  applicationContacts: Contact[]
  domains: Domain[]
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
      input: { applicationContactIds = [], domainIds = [], ...input },
    }: {
      input: Prisma.JobCreateInput & {
        applicationContactIds?: string[]
        domainIds?: string[]
      }
    },
  ): Promise<Job | null> => {
    try {
      const updatedAt = input.updatedAt || dayjs().toDate()
      const controlledInput: Prisma.JobCreateInput = {
        ...input,
        updatedAt,
      }

      const args: Prisma.JobCreateArgs = {
        data: controlledInput,
      }

      const data = await prisma.job.create(args)

      await prisma.job.update({
        data: {
          applicationContacts: {
            connect: applicationContactIds.map(id => ({
              id,
            })),
          },
          domains: {
            connect: domainIds.map(id => ({ id })),
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

      const data = await prisma.job.delete(args)

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
      input: { applicationContactIds = [], domainIds = [], ...input },
    }: {
      id: string
      input: Prisma.JobUpdateInput & {
        applicationContactIds?: string[]
        domainIds?: string[]
      }
    },
  ): Promise<Job | null> => {
    try {
      await prisma.job.update({
        data: {
          applicationContacts: {
            set: [],
          },
          domains: {
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
          domains: true,
        },
        where: {
          id,
        },
      }

      const data = await prisma.job.update(args)

      await prisma.job.update({
        data: {
          applicationContacts: {
            set: [],
          },
          domains: { set: [] },
        },
        where: {
          id,
        },
      })

      await prisma.job.update({
        data: {
          applicationContacts: {
            connect: applicationContactIds.map(id => ({
              id,
            })),
          },
          domains: {
            connect: domainIds.map(id => ({ id })),
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

      const data = await prisma.job.findMany(args)

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
          domains: true,
          infoContact: true,
          profession: true,
          recruiter: true,
        },
        where: {
          id,
        },
      }

      const data = (await prisma.job.findUnique(args)) as unknown as JobFromGetOne | null

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
      source,
      state,
    }: GetAllArgs & {
      source?: JobSource
      state?: JobState
    },
    context: Context,
  ): Promise<GetAllResponse<JobFromGetJobs>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.JobWhereInput> = {}
      if (context.user.role === UserRole.RECRUITER) {
        const { recruiterId } = context.user
        const institution = await prisma.institution.findFirst({
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
      if (source !== undefined) {
        andFilter.source = source
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

      const length = await prisma.job.count(whereFilter)
      const data = (await prisma.job.findMany(args)) as unknown as JobFromGetJobs[]
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

      const length = await prisma.job.count(whereFilter)
      const data = (await prisma.job.findMany(args)) as unknown as JobFromGetPublicJobs[]
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
