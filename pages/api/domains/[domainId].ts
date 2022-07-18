import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiDomainEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getDomain(req, res)
    case 'PUT':
      return updateDomain(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getDomain = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { domainId } = req.query
    const data = await prisma.domain.findUnique({
      where: { id: domainId as string },
    })

    if (!data) {
      res.status(404).send({})
    } else {
      res.send(data)
    }
  } catch (err) {
    handleError(err, 'pages/api/domains/[domainId].ts > query.getDomain()')
    res.status(400).send({})
  }
}

const updateDomain = async (req: NextApiRequest, res: NextApiResponse) => {
  const { domainId } = req.query

  const data = JSON.parse(req.body)
  try {
    const updateResponse = await prisma.domain.update({ data, where: { id: domainId as string } })
    res.status(200).send(updateResponse)
  } catch (err) {
    handleError(err, 'pages/api/domains/[domainId].ts > query.updateDomain()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
