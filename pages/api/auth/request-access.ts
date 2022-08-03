import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

export default async function ApiProfileEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return requestRecruiterAccess(req, res)
    default:
      return defaultResponse(req, res)
  }
}

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

    res.status(200).send(updatedUser)
  } catch (err) {
    handleError(err, 'pages/api/auth/request-access.ts > query.requestRecruiterAccess()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
