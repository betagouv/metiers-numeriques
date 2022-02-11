import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaWhereFilter from '@api/helpers/buildPrismaWhereFilter'
import getPrisma from '@api/helpers/getPrisma'
import handleError from '@common/helpers/handleError'

import type { GetAllArgs, GetAllResponse } from './types'
import type { Contact, Prisma } from '@prisma/client'

export const mutation = {
  createContact: async (
    _parent: undefined,
    { input }: { input: Prisma.ContactCreateInput },
  ): Promise<Contact | null> => {
    try {
      const findUniqueArgs: Prisma.ContactFindUniqueArgs = {
        where: {
          email: input.email,
        },
      }

      const existingData = await getPrisma().contact.findUnique(findUniqueArgs)

      if (existingData !== null) {
        return existingData
      }

      const createArgs: Prisma.ContactCreateArgs = {
        data: input,
      }

      const newData = await getPrisma().contact.create(createArgs)

      return newData
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.createContact()')

      return null
    }
  },

  deleteContact: async (_parent: undefined, { id }: { id: string }): Promise<Contact | null> => {
    try {
      const args: Prisma.ContactDeleteArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().contact.delete(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.deleteContact()')

      return null
    }
  },

  updateContact: async (
    _parent: undefined,
    { id, input }: { id: string; input: Partial<Contact> },
  ): Promise<Contact | null> => {
    try {
      const args: Prisma.ContactUpdateArgs = {
        data: input,
        where: {
          id,
        },
      }

      const data = await getPrisma().contact.update(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.updateContact()')

      return null
    }
  },
}

export const query = {
  getContact: async (_parent: undefined, { id }: { id: string }): Promise<Contact | null> => {
    try {
      const args: Prisma.ContactFindUniqueArgs = {
        where: {
          id,
        },
      }

      const data = await getPrisma().contact.findUnique(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.getContact()')

      return null
    }
  },

  getContacts: async (
    _parent: undefined,
    { pageIndex, perPage, query }: GetAllArgs,
  ): Promise<GetAllResponse<Contact>> => {
    try {
      const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)
      const whereFilter = buildPrismaWhereFilter<Contact>(['email', 'name', 'phone'], query)

      const args: Prisma.ContactFindManyArgs = {
        orderBy: {
          name: 'asc',
        },
        ...paginationFilter,
        ...whereFilter,
      }

      const length = await getPrisma().contact.count(whereFilter)
      const data = await getPrisma().contact.findMany(args)
      const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

      return {
        count,
        data,
        index: pageIndex,
        length,
      }
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.getContacts()')

      return {
        count: 1,
        data: [],
        index: 0,
        length: 0,
      }
    }
  },

  getContactsList: async (): Promise<Contact[]> => {
    try {
      const args: Prisma.ContactFindManyArgs = {
        orderBy: {
          name: 'asc',
        },
      }

      const data = await getPrisma().contact.findMany(args)

      return data
    } catch (err) {
      handleError(err, 'api/resolvers/contacts.ts > query.getContactsList()')

      return []
    }
  },
}
