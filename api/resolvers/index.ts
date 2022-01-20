import buildPrismaSearchFilter from '@api/helpers/buildPrismaSearchFilter'
import getPrisma from '@api/helpers/getPrisma'
import { GraphQLDateTime } from 'graphql-iso-date'
import { GraphQLJSONObject } from 'graphql-type-json'

import * as legacyInstitutions from './legacy-institutions'
import * as legacyJobs from './legacy-jobs'

import type { File, LegacyEntity, LegacyService, User } from '@prisma/client'

type GetAllArgs = {
  fromId?: string
  pageLength?: number
  query?: string
}

export default {
  DateTime: GraphQLDateTime,
  JSONObject: GraphQLJSONObject,
  Mutation: {
    createFile: (obj, { input }: { input: File }) =>
      getPrisma().file.create({
        data: input,
      }),

    createLegacyEntity: (obj, { input }: { input: LegacyEntity }) =>
      getPrisma().legacyEntity.create({
        data: input,
      }),

    createLegacyService: (obj, { input }: { input: LegacyService }) =>
      getPrisma().legacyService.create({
        data: input,
      }),

    deleteFile: (obj, { id }: { id: string }) =>
      getPrisma().file.delete({
        where: {
          id,
        },
      }),

    deleteLegacyEntity: (obj, { id }: { id: string }) =>
      getPrisma().legacyEntity.delete({
        where: {
          id,
        },
      }),

    deleteLegacyService: (obj, { id }: { id: string }) =>
      getPrisma().legacyService.delete({
        where: {
          id,
        },
      }),

    deleteUser: (obj, { id }: { id: string }) =>
      getPrisma().user.delete({
        where: {
          id,
        },
      }),

    updateFile: (obj, { id, input }: { id: string; input: Partial<File> }) =>
      getPrisma().file.update({
        data: input,
        where: {
          id,
        },
      }),

    updateLegacyEntity: (obj, { id, input }: { id: string; input: Partial<LegacyEntity> }) =>
      getPrisma().legacyEntity.update({
        data: input,
        where: {
          id,
        },
      }),

    updateLegacyService: (obj, { id, input }: { id: string; input: Partial<LegacyService> }) =>
      getPrisma().legacyService.update({
        data: input,
        where: {
          id,
        },
      }),

    updateUser: (obj, { id, input }: { id: string; input: User }) =>
      getPrisma().user.update({
        data: input,
        where: {
          id,
        },
      }),

    ...legacyInstitutions.mutation,
    ...legacyJobs.mutation,
  },
  Query: {
    getFile: (obj, { id }: { id: string }) =>
      getPrisma().file.findUnique({
        where: {
          id,
        },
      }),

    getFiles: (obj, { query }: GetAllArgs) => {
      const searchFilter = buildPrismaSearchFilter(['title', 'url'], query)

      return getPrisma().file.findMany(searchFilter)
    },

    getLegacyEntities: (obj, { query }: GetAllArgs) => {
      const searchFilter = buildPrismaSearchFilter(['fullName', 'name'], query)

      return getPrisma().legacyEntity.findMany(searchFilter)
    },

    getLegacyEntity: (obj, { id }: { id: string }) =>
      getPrisma().legacyEntity.findUnique({
        where: {
          id,
        },
      }),

    getLegacyService: (obj, { id }: { id: string }) =>
      getPrisma().legacyService.findUnique({
        include: {
          legacyEntity: true,
        },
        where: {
          id,
        },
      }),

    getLegacyServices: (obj, { query }: GetAllArgs) => {
      const searchFilter = buildPrismaSearchFilter(['fullName', 'name'], query)

      return getPrisma().legacyService.findMany({
        include: {
          legacyEntity: true,
        },
        ...searchFilter,
      })
    },

    getUser: (obj, { id }: { id: string }) =>
      getPrisma().user.findUnique({
        where: {
          id,
        },
      }),

    getUsers: (obj, { query }: GetAllArgs) => {
      const searchFilter = buildPrismaSearchFilter(['email', 'firstName', 'lastName'], query)

      return getPrisma().user.findMany(searchFilter)
    },

    ...legacyInstitutions.query,
    ...legacyJobs.query,
  },
}
