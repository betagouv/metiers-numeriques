import { buildPrismaPaginationFilter } from '@api/helpers/buildPrismaPaginationFilter'
import { buildPrismaWhereFilter } from '@api/helpers/buildPrismaWhereFilter'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

import type { Prisma, Domain } from '@prisma/client'

export default async function ApiDomainsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getDomains(req, res)
    case 'POST':
      return createDomain(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getDomains = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const pageIndex = +(req.query?.pageIndex || 0)
    const perPage = +(req.query?.perPage || 0)
    const query = req.query?.query as string

    const paginationFilter = buildPrismaPaginationFilter(perPage, pageIndex)

    const whereFilter = buildPrismaWhereFilter<Domain>(['name'], query)

    const args: Prisma.DomainFindManyArgs = {
      orderBy: {
        name: 'asc',
      },
      ...paginationFilter,
      ...whereFilter,
    }

    const length = await prisma.domain.count(whereFilter)
    const data = (await prisma.domain.findMany(args)) as unknown as Domain[]
    const count = perPage !== undefined ? Math.ceil(length / perPage) : 1

    res.send({
      count,
      data,
      index: pageIndex,
      length,
    })
  } catch (err) {
    handleError(err, 'pages/api/domains/duplicate.ts > query.getDomains()')

    res.status(400).send({
      count: 1,
      data: [],
      index: 0,
      length: 0,
    })
  }
}

const createDomain = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const createResponse = await prisma.domain.create({ data: JSON.parse(req.body) })
    res.status(201).send(createResponse)
  } catch (err) {
    handleError(err, 'pages/api/domains/duplicate.ts > query.createDomain()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
