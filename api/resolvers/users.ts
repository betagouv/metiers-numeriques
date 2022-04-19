import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { getPrisma } from '@api/helpers/getPrisma'
import { handleError } from '@common/helpers/handleError'
import * as R from 'ramda'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Prisma, Recruiter, User } from '@prisma/client'

export type UserFromGetAll = User & {
  recruiter: Recruiter | null
}

export type UserFromGetOne = User & {
  recruiter: Recruiter | null
}

const omitPasswordIn = R.omit(['password'])
const omitPasswordFor = R.map(omitPasswordIn)

export const mutation = {
  deleteUser: async (_parent: undefined, { id }: { id: string }): Promise<User | null> => {
    try {
      const args: Prisma.UserDeleteArgs = {
        where: {
          id,
        },
      }

      const data = omitPasswordIn(await getPrisma().user.delete(args)) as unknown as User

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.deleteUser()')

      return null
    }
  },

  updateUser: async (_parent: undefined, { id, input }: { id: string; input: Partial<User> }): Promise<User | null> => {
    try {
      let institutionId: string | null = null
      if (typeof input.recruiterId === 'string') {
        const recruiter = await getPrisma().recruiter.findUnique({
          where: {
            id: input.recruiterId,
          },
        })

        if (recruiter === null) {
          throw new Error(`Recruiter with id "${input.recruiterId}" not found.`)
        }

        institutionId = recruiter.institutionId
      }

      const args: Prisma.UserUpdateArgs = {
        data: {
          ...input,
          institutionId,
        },
        where: {
          id,
        },
      }

      const data = omitPasswordIn(await getPrisma().user.update(args)) as unknown as User

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.updateUser()')

      return null
    }
  },
}

export const query = {
  getUser: async (_parent: undefined, { id }: { id: string }): Promise<UserFromGetOne | null> => {
    try {
      const args: Prisma.UserFindUniqueArgs = {
        include: {
          recruiter: true,
        },
        where: {
          id,
        },
      }

      const data = omitPasswordIn(await getPrisma().user.findUnique(args)) as unknown as UserFromGetOne

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.getUser()')

      return null
    }
  },

  getUsers: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<UserFromGetAll>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<User>(['email', 'firstName', 'lastName'], query)

      const args: Prisma.UserFindManyArgs = {
        include: {
          recruiter: true,
        },
        orderBy: {
          lastName: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().user.count(whereFilter)
      const data = omitPasswordFor(await getPrisma().user.findMany(args)) as unknown as UserFromGetAll[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.getUsers()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
