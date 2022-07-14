import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobState } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiJobsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getPublishedJobs(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getPublishedJobs = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await prisma.job.findMany({
      where: {
        expiredAt: {
          gt: new Date(),
        },
        state: JobState.PUBLISHED,
      },
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/jobs/index.ts > query.getPublishedJobs()')

    res.status(400).send([])
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
