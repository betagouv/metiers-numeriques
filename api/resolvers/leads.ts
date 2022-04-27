import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Lead, Prisma } from '@prisma/client'

export const mutation = {
  deleteLead: async (_parent: undefined, { id }: { id: string }): Promise<Lead | null> => {
    try {
      const args: Prisma.LeadDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await prisma.lead.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/leads.ts > query.deleteLead()')

      return null
    }
  },

  updateLead: async (_parent: undefined, { id, input }: { id: string; input: Partial<Lead> }): Promise<Lead | null> => {
    try {
      const args: Prisma.LeadUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await prisma.lead.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/leads.ts > query.updateLead()')

      return null
    }
  },
}

export const query = {
  getLead: async (_parent: undefined, { id }: { id: string }): Promise<Lead | null> => {
    try {
      const args: Prisma.LeadFindUniqueArgs = {
        include: {
          fromJob: true,
        },
        where: {
          id,
        },
      }

      const data = await prisma.lead.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/leads.ts > query.getLead()')

      return null
    }
  },

  getLeads: async (
    _parent: undefined,
    {
      pageIndex,
      perPage,
      query,
    }: GetAllArgs & {
      region?: string
      source?: string
    },
  ): Promise<GetAllResponse<Lead>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

      const whereFilter = buildPrismaWhereFilter<Lead>(['email'], query)

      const args: Prisma.LeadFindManyArgs = {
        include: {
          fromJob: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await prisma.lead.count(whereFilter)
      const data = await prisma.lead.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/leads.ts > query.getLeads()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
