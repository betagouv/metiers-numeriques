import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { sendAccountRequestEmail } from '@api/libs/sendInBlue'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

const requestRecruiterAccess = async (req: NextApiRequest, res: NextApiResponse) => {
  const auth = await getSession({ req })

  if (!auth) {
    res.status(401).end()

    return
  }

  const { requestedInstitution, requestedService } = JSON.parse(req.body)

  try {
    const updatedUser = await prisma.user.update({
      data: {
        extra: { requestedInstitution, requestedService },
      },
      where: {
        id: auth.user.id,
      },
    })

    await sendAccountRequestEmail(`${auth.user.firstName} ${auth.user.lastName}`, auth.user.id)

    res.status(200).send(updatedUser)
  } catch (err) {
    handleError(err, 'pages/api/auth/request-access.ts > query.requestRecruiterAccess()')
    res.status(400).end()
  }
}

export default ApiEndpoint({
  POST: {
    handler: requestRecruiterAccess,
    permission: 'RECRUITER',
  },
})
