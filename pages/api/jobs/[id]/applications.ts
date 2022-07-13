import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiJobApplicationsEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getJobApplications(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const getJobApplications = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query

    const data = await prisma.jobApplication.findMany({
      include: {
        candidate: {
          include: { domains: true, user: true },
        },
        cvFile: true,
      },
      where: { jobId: id as string },
    })

    res.send(data)
  } catch (err) {
    handleError(err, 'pages/api/job-applications/index.ts > query.getJobApplications()')

    res.status(400).send([])
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
