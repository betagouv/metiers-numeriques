import { ApiEndpoint } from '@api/libs/endpoint'
import { prisma } from '@api/libs/prisma'
import { sendResetPasswordEmail } from '@api/libs/sendInBlue'
import { handleError } from '@common/helpers/handleError'
import { NextApiRequest, NextApiResponse } from 'next'

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

export default ApiEndpoint({
  POST: {
    handler: handleForgotPassword,
  },
})
