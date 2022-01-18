import buildPrismaPaginationFilter from '@api/helpers/buildPrismaPaginationFilter'
import buildPrismaSearchFilter from '@api/helpers/buildPrismaSearchFilter'
import getPrisma from '@api/helpers/getPrisma'
import { JOB_SOURCE } from '@common/constants'
import handleError from '@common/helpers/handleError'
import * as R from 'ramda'

import type { LegacyJob } from '@prisma/client'

type GetAllArgs = {
  fromId?: string
  pageLength?: number
  query?: string
}

export const mutation = {
  createLegacyJob: (obj, { input }: { input: LegacyJob }) => {
    try {
      return getPrisma().legacyJob.create({
        data: input,
      })
    } catch (err) {
      handleError(err, 'api/resolvers/legacy-jobs.ts > createLegacyJob()')

      return {}
    }
  },

  deleteLegacyJob: (obj, { id }: { id: string }) =>
    getPrisma().legacyJob.delete({
      where: {
        id,
      },
    }),

  updateLegacyJob: (obj, { id, input }: { id: string; input: Partial<LegacyJob> }) =>
    getPrisma().legacyJob.update({
      data: input,
      where: {
        id,
      },
    }),
}

export const query = {
  getLegacyJob: (obj, { id, slug }: { id: string; slug: undefined } | { id: undefined; slug: string }) => {
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

  getLegacyJobs: (obj, { fromId, pageLength, query }: GetAllArgs) => {
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
}
