import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaSearchFilter from '@api/helpers/buildPrismaSearchFilter'
import getPrisma from '@api/helpers/getPrisma'
import { JOB_SOURCE } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLJSONObject } from 'graphql-type-json'
import * as R from 'ramda'

import type { File, LegacyEntity, LegacyInstitution, LegacyJob, LegacyService, User } from '@prisma/client'

type GetAllArgs = {
  fromId?: string
  pageLength?: number
  query?: string
}

export default {
  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
  Mutation: {
    createFile(obj, { input }: { input: File }) {
      return getPrisma().file.create({
        data: input,
      })
    },

    createLegacyEntity(obj, { input }: { input: LegacyEntity }) {
      return getPrisma().legacyEntity.create({
        data: input,
      })
    },

    createLegacyInstitution(obj, { input }: { input: LegacyInstitution }) {
      try {
        return getPrisma().legacyInstitution.create({
          data: input,
        })
      } catch (err) {
        handleError(err, 'pages/api/graphql.ts > resolvers.createLegacyInstitution()')
      }
    },

    createLegacyJob(obj, { input }: { input: LegacyJob }) {
      try {
        return getPrisma().legacyJob.create({
          data: input,
        })
      } catch (err) {
        handleError(err, 'api/resolvers/legacy-jobs.ts > createLegacyJob()')

        return {}
      }
    },

    createLegacyService(obj, { input }: { input: LegacyService }) {
      return getPrisma().legacyService.create({
        data: input,
      })
    },

    deleteFile(obj, { id }: { id: string }) {
      return getPrisma().file.delete({
        where: {
          id,
        },
      })
    },

    deleteLegacyEntity(obj, { id }: { id: string }) {
      return getPrisma().legacyEntity.delete({
        where: {
          id,
        },
      })
    },

    deleteLegacyInstitution(obj, { id }: { id: string }) {
      return getPrisma().legacyInstitution.delete({
        where: {
          id,
        },
      })
    },

    deleteLegacyJob(obj, { id }: { id: string }) {
      return getPrisma().legacyJob.delete({
        where: {
          id,
        },
      })
    },

    deleteLegacyService(obj, { id }: { id: string }) {
      return getPrisma().legacyService.delete({
        where: {
          id,
        },
      })
    },

    deleteUser(obj, { id }: { id: string }) {
      return getPrisma().user.delete({
        where: {
          id,
        },
      })
    },

    updateFile(obj, { id, input }: { id: string; input: Partial<File> }) {
      return getPrisma().file.update({
        data: input,
        where: {
          id,
        },
      })
    },

    updateLegacyEntity(obj, { id, input }: { id: string; input: Partial<LegacyEntity> }) {
      return getPrisma().legacyEntity.update({
        data: input,
        where: {
          id,
        },
      })
    },

    updateLegacyInstitution(obj, { id, input }: { id: string; input: Partial<LegacyInstitution> }) {
      return getPrisma().legacyInstitution.update({
        data: input as any,
        where: {
          id,
        },
      })
    },

    updateLegacyJob(obj, { id, input }: { id: string; input: Partial<LegacyJob> }) {
      return getPrisma().legacyJob.update({
        data: input,
        where: {
          id,
        },
      })
    },

    updateLegacyService(obj, { id, input }: { id: string; input: Partial<LegacyService> }) {
      return getPrisma().legacyService.update({
        data: input,
        where: {
          id,
        },
      })
    },

    updateUser(obj, { id, input }: { id: string; input: User }) {
      return getPrisma().user.update({
        data: input,
        where: {
          id,
        },
      })
    },
  },
  Query: {
    getFile(obj, { id }: { id: string }) {
      return getPrisma().file.findUnique({
        where: {
          id,
        },
      })
    },

    getFiles(obj, { query }: GetAllArgs) {
      const searchFilter = buildPrismaSearchFilter(['title', 'url'], query)

      return getPrisma().file.findMany(searchFilter)
    },

    getLegacyEntities(obj, { query }: GetAllArgs) {
      const searchFilter = buildPrismaSearchFilter(['fullName', 'name'], query)

      return getPrisma().legacyEntity.findMany(searchFilter)
    },

    getLegacyEntity(obj, { id }: { id: string }) {
      return getPrisma().legacyEntity.findUnique({
        where: {
          id,
        },
      })
    },

    getLegacyInstitution(obj, { id, slug }: { id: string; slug: undefined } | { id: undefined; slug: string }) {
      const where =
        id !== undefined
          ? {
              id,
            }
          : {
              slug,
            }

      return getPrisma().legacyInstitution.findUnique({
        include: {
          logoFile: true,
          thumbnailFile: true,
        },
        where,
      })
    },

    getLegacyInstitutions(obj, { fromId, pageLength, query }: GetAllArgs) {
      const paginationFilter = buildPrismaPaginationFilter(pageLength, fromId)
      const searchFilter = buildPrismaSearchFilter(['fullName', 'title'], query)

      return getPrisma().legacyInstitution.findMany({
        include: {
          logoFile: true,
          thumbnailFile: true,
        },
        orderBy: {
          title: 'asc',
        },
        ...paginationFilter,
        ...searchFilter,
      })
    },

    getLegacyJob(obj, { id, slug }: { id: string; slug: undefined } | { id: undefined; slug: string }) {
      const where =
        id !== undefined
          ? {
              id,
            }
          : {
              slug,
            }

      return getPrisma().legacyJob.findUnique({
        include: {
          legacyService: {
            include: {
              legacyEntity: true,
            },
          },
        },
        where,
      })
    },

    getLegacyJobs(obj, { fromId, pageLength, query }: GetAllArgs) {
      const paginationFilter = buildPrismaPaginationFilter(pageLength, fromId)
      const maybeSearchFilter = buildPrismaSearchFilter(['title'], query)
      const searchFilter = R.isEmpty(maybeSearchFilter)
        ? {
            where: {
              source: JOB_SOURCE.MNN,
            },
          }
        : maybeSearchFilter

      return getPrisma().legacyJob.findMany({
        include: {
          legacyService: {
            include: {
              legacyEntity: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        ...paginationFilter,
        ...searchFilter,
      })
    },

    getLegacyService(obj, { id }: { id: string }) {
      return getPrisma().legacyService.findUnique({
        include: {
          legacyEntity: true,
        },
        where: {
          id,
        },
      })
    },

    getLegacyServices(obj, { query }: GetAllArgs) {
      const searchFilter = buildPrismaSearchFilter(['fullName', 'name'], query)

      return getPrisma().legacyService.findMany({
        include: {
          legacyEntity: true,
        },
        ...searchFilter,
      })
    },

    getUser(obj, { id }: { id: string }) {
      return getPrisma().user.findUnique({
        where: {
          id,
        },
      })
    },

    getUsers(obj, { query }: GetAllArgs) {
      const searchFilter = buildPrismaSearchFilter(['email', 'firstName', 'lastName'], query)

      return getPrisma().user.findMany(searchFilter)
    },
  },
}
