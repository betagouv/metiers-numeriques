import { UserRole } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type Endpoints = {
  [key in Method]?: {
    handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
    /** If public, don't fill `permission` */
    permission?: UserRole | 'ME'
  }
}

export const ApiEndpoint = (endpoints: Endpoints) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.method || !(req.method in endpoints)) {
    // Page not found
    return res.status(405).send('Not Allowed')
  }

  const { handler, permission } = endpoints[req.method]

  if (permission) {
    const { institutionId, recruiterId, userId } = req.query
    const session = await getSession({ req })

    if (!session || !session.user) {
      // Unauthenticated user
      return res.status(401).send('Unauthorized')
    }

    const { user } = session

    switch (permission) {
      case 'ME':
        if (userId && user.id !== userId) {
          return res.status(403).send('Forbidden')
        }
        break
      case UserRole.ADMINISTRATOR:
        if (user.role !== UserRole.ADMINISTRATOR) {
          // Forbidden
          return res.status(403).send('Forbidden')
        }
        break
      case UserRole.RECRUITER:
        if (user.role === UserRole.CANDIDATE) {
          // Forbidden
          return res.status(403).send('Forbidden')
        }
        if (user.role === UserRole.RECRUITER) {
          if (institutionId && user.institutionId !== institutionId) {
            // Forbidden
            return res.status(403).send('Forbidden')
          }
          if (recruiterId && user.recruiterId !== recruiterId) {
            // Forbidden
            return res.status(403).send('Forbidden')
          }
        }
        break
      case UserRole.CANDIDATE:
        break
      default:
        break
    }
  }

  return handler(req, res)
}
