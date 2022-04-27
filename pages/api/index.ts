import { ApiError } from '@api/libs/ApiError'
import { handleError } from '@common/helpers/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'

const { npm_package_version: VERSION } = process.env
const ERROR_PATH = 'pages/api/auth/IndexController()'

export default async function ApiIndex(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
    }

    const data = {
      version: VERSION,
    }

    res.status(200).json({ data })
  } catch (err) {
    handleError(err, ERROR_PATH, res)
  }
}
