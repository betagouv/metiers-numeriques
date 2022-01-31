import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Job, Prisma, Profession } from '@prisma/client'

export type ProfessionFromGetAll = Profession & {
  _count: {
    jobs: number
  }
}

export type ProfessionFromGetOne = Profession & {
  jobs: Job[]
}

export const mutation = {
  createProfession: async (
    _parent: undefined,
    { input }: { input: Prisma.ProfessionCreateInput },
  ): Promise<Profession | null> => {
    try {
      const args: Prisma.ProfessionCreateArgs = {
        data: input,
      }

      const data = await getPrisma().profession.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.createProfession()')

      return null
    }
  },

  deleteProfession: async (_parent: undefined, { id }: { id: string }): Promise<Profession | null> => {
    try {
      const args: Prisma.ProfessionDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().profession.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.deleteProfession()')

      return null
    }
  },

  updateProfession: async (
    _parent: undefined,
    { id, input }: { id: string; input: Partial<Profession> },
  ): Promise<Profession | null> => {
    try {
      const args: Prisma.ProfessionUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().profession.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.updateProfession()')

      return null
    }
  },
}

export const query = {
  getProfession: async (_parent: undefined, { id }: { id: string }): Promise<ProfessionFromGetOne | null> => {
    try {
      const args: Prisma.ProfessionFindUniqueArgs = {
        include: {
          jobs: true,
        },
        where: {
          id,
        },
      }

      const data = (await getPrisma().profession.findUnique(args)) as unknown as ProfessionFromGetOne | null

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.getProfession()')

      return null
    }
  },

  getProfessions: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<ProfessionFromGetAll>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<Profession>(['name'], query)

      const args: Prisma.ProfessionFindManyArgs = {
        include: {
          _count: {
            select: {
              jobs: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().profession.count(whereFilter)
      const data = (await getPrisma().profession.findMany(args)) as unknown as ProfessionFromGetAll[]
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.getProfessions()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getProfessionsList: async (): Promise<Profession[]> => {
    try {
      const args: Prisma.ProfessionFindManyArgs = {
        orderBy: {
          name: 'asc',
        },
      }

      const data = await getPrisma().profession.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/professions.ts > query.getProfessionsList()')

      return []
    }
  },
}
