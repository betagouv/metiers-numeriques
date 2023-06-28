import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import * as R from 'ramda'

const duplicateJobApplication = async (req: NextApiRequest, res: NextApiResponse) => {
  const { applicationId } = req.query
  const body = JSON.parse(req.body)

  try {
    const application = await prisma.jobApplication.findUnique({ where: { id: applicationId as string } })
    const duplicateResponse = await prisma.jobApplication.create({
      data: { ...R.pick(['candidateId', 'cvFileId', 'applicationLetter'], application), ...body },
    })
    res.status(200).send(duplicateResponse)
  } catch (err) {
    handleError(err, 'pages/api/domains/[domainId].ts > query.updateJobApplication()')
    res.status(400).end()
  }
}

export default ApiEndpoint({
  POST: {
    handler: duplicateJobApplication,
    permission: 'RECRUITER',
  },
})
