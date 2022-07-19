import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiJobsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getJob(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getJob = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query
  try {
    const data = await prisma.job.findUnique({
      where: { id: id as string },
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/jobs/duplicate.ts > query.getPublishedJobs()')

    res.status(400).send([])
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
