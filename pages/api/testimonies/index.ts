import { buildPrismaPaginationFilter } from '@api/helpers/buildPrismaPaginationFilter'
import { buildPrismaWhereFilter } from '@api/helpers/buildPrismaWhereFilter'
import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

import type { Prisma, Testimony } from '@prisma/client'

const getTestimonies = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pageIndex = +(req.query?.pageIndex || 0)
    const perPage = +(req.query?.perPage || 10) // TODO: default value here
    const query = req.query?.query as string

    const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

    const whereFilter = buildPrismaWhereFilter<Testimony>(['name'], query)

    const args: Prisma.TestimonyFindManyArgs = {
      include: {
        institution: true,
      },
      orderBy: {
        name: 'asc',
      },
      ...paginationFilter,
      ...whereFilter,
    }

    const length = await prisma.testimony.count(whereFilter)
    const data = (await prisma.testimony.findMany(args)) as unknown as Testimony[]
    const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

    res.send({
      count,
      data,
      index: pageIndex,
      length,
    })
  } catch (err) {
    handleError(err, 'pages/api/testimonies/duplicate.ts > query.getTestimonies()')

    res.status(400).send({
      count: 1,
      data: [],
      index: 0,
      length: 0,
    })
  }
}

const createTestimony = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const createResponse = await prisma.testimony.create({ data: JSON.parse(req.body) })
    res.status(201).send(createResponse)
  } catch (err) {
    handleError(err, 'pages/api/testimonies/duplicate.ts > query.createTestimony()')
    res.status(400).end()
  }
}

export default ApiEndpoint({
  GET: {
    handler: getTestimonies,
    permission: 'ADMINISTRATOR',
  },
  POST: {
    handler: createTestimony,
    permission: 'ADMINISTRATOR',
  },
})
