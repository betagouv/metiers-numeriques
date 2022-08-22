import { prisma } from '@api/libs/prisma'
import { handleError } from '@common/helpers/handleError'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import { encryptPassword } from 'pages/api/auth/signup'

export default async function ApiSignUpEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return resetPassword(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { password, resetToken } = JSON.parse(req.body)

    const decodedToken = await jwt.verify(resetToken, process.env.NEXTAUTH_SECRET)

    if (!password) {
      throw new Error('Cannot reset a password with an empty string')
    }

    if (!decodedToken) {
      throw new Error('Error decoding reset password token')
    }

    const newPassword = await encryptPassword(password)
    await prisma.user.update({
      data: {
        password: newPassword,
      },
      where: {
        id: decodedToken.userId,
      },
    })

    res.status(204).end()
  } catch (err) {
    handleError(err, 'pages/api/auth/reset-password.ts > query.resetPassword()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
