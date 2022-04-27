import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { File, Prisma } from '@prisma/client'

export const mutation = {
  createFile: async (_parent: undefined, { input }: { input: Prisma.FileCreateInput }): Promise<File | null> => {
    try {
      const args: Prisma.FileCreateArgs = {
        data: input,
      }

      const data = await prisma.file.create(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/files.ts > query.createFile()')

      return null
    }
  },

  deleteFile: async (_parent: undefined, { id }: { id: string }): Promise<File | null> => {
    try {
      const args: Prisma.FileDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await prisma.file.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/files.ts > query.deleteFile()')

      return null
    }
  },

  updateFile: async (_parent: undefined, { id, input }: { id: string; input: Partial<File> }): Promise<File | null> => {
    try {
      const args: Prisma.FileUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await prisma.file.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/files.ts > query.updateFile()')

      return null
    }
  },
}

export const query = {
  getFile: async (_parent: undefined, { id }: { id: string }): Promise<File | null> => {
    try {
      const args: Prisma.FileFindUniqueArgs = {
        where: {
          id,
        },
      }

      const data = await prisma.file.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/files.ts > query.getFile()')

      return null
    }
  },

  getFiles: async (_parent: undefined, { pageIndex, perPage, query }: GetAllArgs): Promise<GetAllResponse<File>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<File>(['title', 'url'], query)

      const args: Prisma.FileFindManyArgs = {
        orderBy: {
          title: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await prisma.file.count(whereFilter)
      const data = await prisma.file.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/files.ts > query.getFiles()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },
}
