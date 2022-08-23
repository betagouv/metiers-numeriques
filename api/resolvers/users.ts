import { buildPrismaOrderByFilter } from '@api/helpers/buildPrismaOrderByFilter'
import { sendRecruiterAccountActivated } from '@api/libs/sendInBlue'
import { handleError } from '@common/helpers/handleError'
import { UserRole } from '@prisma/client'
import * as R from 'ramda'

import { buildPrismaPaginationFilter } from '../helpers/buildPrismaPaginationFilter'
import { buildPrismaWhereFilter } from '../helpers/buildPrismaWhereFilter'
import { prisma } from '../libs/prisma'

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

      const data = omitPasswordIn(await prisma.user.delete(args)) as unknown as User

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.deleteUser()')

      return null
    }
  },

  updateUser: async (
    _parent: undefined,
    {
      id,
      input,
    }: {
      id: string
      input: Partial<Prisma.UserUncheckedUpdateInput>
    },
  ): Promise<User | null> => {
    try {
      let institutionId: string | null = null
      if (typeof input.recruiterId === 'string') {
        const recruiter = await prisma.recruiter.findUnique({
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

      const data = omitPasswordIn(await prisma.user.update(args)) as unknown as User

      if (data.isActive && data.role !== UserRole.CANDIDATE) {
        await sendRecruiterAccountActivated(data)
      }

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

      const data = omitPasswordIn(await prisma.user.findUnique(args)) as unknown as UserFromGetOne

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/users.ts > query.getUser()')

      return null
    }
  },

  getUsers: async (
    _parent: undefined,
    {
      isActive,
      orderBy,
      pageIndex,
      perPage,
      query,
    }: GetAllArgs<User> & {
      isActive?: boolean
    },
  ): Promise<GetAllResponse<UserFromGetAll>> => {
    try {
      const orderByFilter = buildPrismaOrderByFilter<User>(['updatedAt', 'desc'], orderBy)

      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const andFilter: Prisma.Enumerable<Prisma.UserWhereInput> = {}
      if (isActive !== undefined) {
        andFilter.isActive = isActive
      }
      const whereFilter = buildPrismaWhereFilter<User>(['email', 'firstName', 'lastName'], query, andFilter)

      const args: Prisma.UserFindManyArgs = {
        include: {
          recruiter: true,
        },
        ...orderByFilter,
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await prisma.user.count(whereFilter)
      const data = omitPasswordFor(await prisma.user.findMany(args)) as unknown as UserFromGetAll[]
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
