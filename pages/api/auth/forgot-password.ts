import { prisma } from '@api/libs/prisma'
import { sendResetPasswordEmail } from '@api/libs/sendInBlue'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function ApiSignUpEndpoint(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return handleForgotPassword(req, res)
    default:
      return defaultResponse(req, res)
  }
}

const handleForgotPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email } = JSON.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })

    if (user) {
      await sendResetPasswordEmail(user)
    }

    res.status(204).end()
  } catch (err) {
    handleError(err, 'pages/api/auth/forgot-password.ts > query.handleForgotPassword()')
    res.status(400).end()
  }
}

const defaultResponse = (req: NextApiRequest, res: NextApiResponse) => res.status(404)
