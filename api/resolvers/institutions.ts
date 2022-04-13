import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Institution, Job, Prisma, Recruiter, User } from '@prisma/client'

export type RecruiterWithJobsAndUsers = Recruiter & {
  jobs: Job[]
  users: User[]
}

export type InstitutionFromGetOne = Institution & {
  recruiters: RecruiterWithJobsAndUsers[]
}

export type InstitutionFromGetAll = Institution & {
  recruiters: Recruiter[]
}

export type InstitutionFromGetAllPublic = InstitutionFromGetAll

const PUBLIC_PER_PAGE_THROTTLE = 12

export const mutation = {
  createInstitution: async (
    _parent: undefined,
    {
      input,
    }: {
      input: Prisma.InstitutionCreateInput
    },
  ): Promise<Institution | null> => {
    try {
      const args: Prisma.InstitutionCreateArgs = {
        data: input,
      }

      const data = await getPrisma().institution.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.createInstitution()')

      return null
    }
  },

  deleteInstitution: async (_parent: undefined, { id }: { id: string }): Promise<Institution | null> => {
    try {
      const args: Prisma.InstitutionDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().institution.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.deleteInstitution()')

      return null
    }
  },

  updateInstitution: async (
    _parent: undefined,
    {
      id,
      input,
    }: {
      id: string
      input: Prisma.InstitutionUpdateInput
    },
  ): Promise<Institution | null> => {
    try {
      const args: Prisma.InstitutionUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().institution.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.updateInstitution()')

      return null
    }
  },
}

export const query = {
  getAllInstitutions: async (): Promise<Institution[]> => {
    try {
      const args: Prisma.InstitutionFindManyArgs = {
        orderBy: {
          updatedAt: 'desc',
        },
      }

      const data = await getPrisma().institution.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.getAllInstitutions()')

      return []
    }
  },

  getInstitution: async (_parent: undefined, { id }: { id: string }): Promise<InstitutionFromGetOne | null> => {
    try {
      const args: Prisma.InstitutionFindUniqueArgs = {
        include: {
          recruiters: {
            include: {
              jobs: true,
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
          },
        },
        where: {
          id,
        },
      }

      const data = (await getPrisma().institution.findUnique(args)) as unknown as InstitutionFromGetOne | null

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.getInstitution()')

      return null
    }
  },

  getInstitutions: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<InstitutionFromGetAll>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const whereFilter = buildPrismaWhereFilter<InstitutionFromGetAll>(['name'], query)

      const args: Prisma.InstitutionFindManyArgs = {
        include: {
          recruiters: true,
        },
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().institution.count(whereFilter)
      const data = (await getPrisma().institution.findMany(args)) as unknown as InstitutionFromGetAll[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.getInstitutions()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getInstitutionsList: async (): Promise<Institution[]> => {
    try {
      const args: Prisma.InstitutionFindManyArgs = {
        orderBy: {
          name: 'asc',
        },
      }

      const data = await getPrisma().institution.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.getInstitutionsList()')

      return []
    }
  },

  getPublicInstitutions: async (obj, queryArgs: GetAllArgs): Promise<GetAllResponse<InstitutionFromGetAllPublic>> => {
    try {
      const { pageIndex, perPage, query } = queryArgs

      const throttledPerPage = perPage <= PUBLIC_PER_PAGE_THROTTLE ? perPage : 1

      const paginationFilter = buildPrismaPaginationFilter(throttledPerPage, pageIndex)

      const whereFilter = buildPrismaWhereFilter<InstitutionFromGetAllPublic>(['name'], query)

      const args = {
        include: {
          recruiters: true,
        },
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().institution.count(whereFilter)
      const data = (await getPrisma().institution.findMany(args)) as unknown as InstitutionFromGetAllPublic[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/institutions.ts > query.getPublicInstitutions()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
