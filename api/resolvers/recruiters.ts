import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { getPrisma } from '@api/helpers/getPrisma'
import { handleError } from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { File, Job, JobSource, Prisma, Recruiter, User } from '@prisma/client'

export type RecruiterFromGetAll = Recruiter & {
  _count: {
    jobs: number
    users: number
  }
}

export type RecruiterFromGetOne = Recruiter & {
  children: Recruiter[]
  jobs: Job[]
  logoFile: File
  parent: Recruiter | null
  users: User[]
}

export const mutation = {
  createRecruiter: async (
    _parent: undefined,
    { input }: { input: Prisma.RecruiterCreateInput },
  ): Promise<Recruiter | null> => {
    try {
      if (typeof input.displayName !== 'string') {
        throw new Error('`displayName` is required.')
      }

      const args: Prisma.RecruiterCreateArgs = {
        data: {
          ...input,
          name: input.displayName,
        },
      }

      const data = await getPrisma().recruiter.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/recruiters.ts > query.createRecruiter()')

      return null
    }
  },

  deleteRecruiter: async (_parent: undefined, { id }: { id: string }): Promise<Recruiter | null> => {
    try {
      const args: Prisma.RecruiterDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().recruiter.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/recruiters.ts > query.deleteRecruiter()')

      return null
    }
  },

  updateRecruiter: async (
    _parent: undefined,
    { id, input }: { id: string; input: Partial<Recruiter> },
  ): Promise<Recruiter | null> => {
    try {
      if (input.displayName === null) {
        throw new Error('`displayName` can’t be null.')
      }

      const args: Prisma.RecruiterUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().recruiter.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/recruiters.ts > query.updateRecruiter()')

      return null
    }
  },
}

export const query = {
  getRecruiter: async (_parent: undefined, { id }: { id: string }): Promise<RecruiterFromGetOne | null> => {
    try {
      const args: Prisma.RecruiterFindUniqueArgs = {
        include: {
          children: true,
          institution: true,
          jobs: true,
          logoFile: true,
          parent: true,
          users: {
            select: {
              email: true,
              firstName: true,
              id: true,
              lastName: true,
              role: true,
            },
          },
        },
        where: {
          id,
        },
      }

      const data = (await getPrisma().recruiter.findUnique(args)) as unknown as RecruiterFromGetOne | null

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/recruiters.ts > query.getRecruiter()')

      return null
    }
  },

  getRecruiters: async (
    _parent: undefined,
    {
      pageIndex,
      perPage,
      query,
      source,
    }: GetAllArgs & {
      source?: JobSource
    },
  ): Promise<GetAllResponse<RecruiterFromGetAll>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.RecruiterWhereInput> = {}
      if (source !== undefined) {
        andFilter.source = source
      }
      const whereFilter = buildPrismaWhereFilter<Recruiter>(['fullName', 'name'], query, andFilter)

      const args: Prisma.RecruiterFindManyArgs = {
        include: {
          _count: {
            select: {
              jobs: true,
              users: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().recruiter.count(whereFilter)
      const data = (await getPrisma().recruiter.findMany(args)) as unknown as RecruiterFromGetAll[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/recruiter.ts > query.getRecruiters()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getRecruitersList: async (
    _parent: undefined,
    {
      institutionId,
    }: {
      institutionId?: string
    },
  ): Promise<Recruiter[]> => {
    try {
      const andFilter: Prisma.Enumerable<Prisma.RecruiterWhereInput> = {
        institutionId:
          typeof institutionId === 'string'
            ? institutionId
            : {
                not: null,
              },
      }
      const whereFilter = buildPrismaWhereFilter<Recruiter>(['fullName', 'name'], undefined, andFilter)

      const args: Prisma.RecruiterFindManyArgs = {
        orderBy: {
          name: 'asc',
        },
        ...whereFilter,
      }

      const data = await getPrisma().recruiter.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/recruiters.ts > query.getRecruitersList()')

      return []
    }
  },
}
