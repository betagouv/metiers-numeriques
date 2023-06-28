import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { JobApplicationStatus } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const changeJobApplicationStatus =
  (status: JobApplicationStatus) => async (req: NextApiRequest, res: NextApiResponse) => {
    const { applicationId } = req.query

    try {
      const updateResponse = await prisma.jobApplication.update({
        data: { rejectionReasons: [], status },
        where: { id: applicationId as string },
      })
      res.status(200).send(updateResponse)
    } catch (err) {
      handleError(err, 'pages/api/domains/[domainId].ts > query.updateDomain()')
      res.status(400).end()
    }
  }

export default ApiEndpoint({
  DELETE: {
    handler: changeJobApplicationStatus(JobApplicationStatus.PENDING),
    permission: 'RECRUITER',
  },
  PUT: {
    handler: changeJobApplicationStatus(JobApplicationStatus.ACCEPTED),
    permission: 'RECRUITER',
  },
})
