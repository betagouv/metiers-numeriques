import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobApplicationStatus } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiAcceptJobApplicationEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'PUT':
      return changeJobApplicationStatus(JobApplicationStatus.ACCEPTED)(req, res)
    case 'DELETE':
      return changeJobApplicationStatus(JobApplicationStatus.PENDING)(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const changeJobApplicationStatus =
  (status: JobApplicationStatus) => async (req: NextApiRequest, res: NextApiResponse) => {
    const { applicationId } = req.query

    try {
      const updateResponse = await prisma.jobApplication.update({
        data: { status },
        where: { id: applicationId as string },
      })
      res.status(200).send(updateResponse)
    } catch (err) {
      handleError(err, 'pages/api/domains/[domainId].ts > query.updateDomain()')
      res.status(400).end()
    }
  }

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
