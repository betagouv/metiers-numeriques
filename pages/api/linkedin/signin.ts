import handleError from '@common/helpers/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/linkedin/signin'

export default async function ApiLinkedinSigninEndpoint(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.json({})
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}
