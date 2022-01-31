import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Address, Prisma } from '@prisma/client'

export const mutation = {
  createAddress: async (
    _parent: undefined,
    { input }: { input: Prisma.AddressCreateInput },
  ): Promise<Address | null> => {
    try {
      const args: Prisma.AddressCreateArgs = {
        data: input,
      }

      const data = await getPrisma().address.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.createAddress()')

      return null
    }
  },

  deleteAddress: async (_parent: undefined, { id }: { id: string }): Promise<Address | null> => {
    try {
      const args: Prisma.AddressDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().address.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/addresses.ts > query.deleteAddress()')

      return null
    }
  },
}

export const query = {
  getAddresses: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<Address>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<Address>(['city', 'postalCode', 'street'], query)

      const args: Prisma.AddressFindManyArgs = {
        orderBy: {
          postalCode: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().address.count(whereFilter)
      const data = await getPrisma().address.findMany(args)
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
