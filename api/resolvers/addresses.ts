import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'
import * as R from 'ramda'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Address, Prisma } from '@prisma/client'

export type AddressFromGetAddresses = Address & {
  _count: {
    jobs: number
    users: number
  }
}

export const mutation = {
  createAddress: async (
    _parent: undefined,
    { input }: { input: Prisma.AddressCreateInput },
  ): Promise<Address | null> => {
    try {
      if (!R.isNil(input.sourceId)) {
        const findFirstArgs: Prisma.AddressFindFirstArgs = {
          where: {
            sourceId: input.sourceId,
          },
        }

        const existingData = await getPrisma().address.findFirst(findFirstArgs)

        if (existingData !== null) {
          return existingData
        }
      }

      const createArgs: Prisma.AddressCreateArgs = {
        data: input,
      }

      const newData = await getPrisma().address.create(createArgs)

      return newData
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.createAddress()')

      return null
    }
  },

  deleteAddress: async (_parent: undefined, { id }: { id: string }): Promise<Address | null> => {
    try {
      const args: Prisma.AddressDeleteArgs = {
        include: {
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        where: {
          id,
        },
      }

      const data = (await getPrisma().address.findUnique(args)) as unknown as AddressFromGetAddresses | null

      if (data === null || data._count.jobs > 0) {
        return null
      }

      await getPrisma().address.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.deleteAddress()')

      return null
    }
  },

  updateAddress: async (
    _parent: undefined,
    { id, input }: { id: string; input: Partial<Address> },
  ): Promise<Address | null> => {
    try {
      const args: Prisma.AddressUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().address.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.updateAddress()')

      return null
    }
  },
}

export const query = {
  getAddress: async (_parent: undefined, { id }: { id: string }): Promise<Address | null> => {
    try {
      const args: Prisma.AddressFindUniqueArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().address.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.getAddress()')

      return null
    }
  },

  getAddresses: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<AddressFromGetAddresses>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<AddressFromGetAddresses>(
        ['city', 'postalCode', 'region', 'street'],
        query,
      )

      const args: Prisma.AddressFindManyArgs = {
        include: {
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        orderBy: {
          postalCode: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().address.count(whereFilter)
      const data = (await getPrisma().address.findMany(args)) as unknown as AddressFromGetAddresses[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.getAddresses()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
