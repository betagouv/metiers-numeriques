import handleError from '@common/helpers/handleError'
import { NextApiResponse } from 'next'

import ApiError from '../../api/libs/ApiError'
import { RequestWithPrisma } from '../../api/types'

const { npm_package_version: VERSION } = process.env
const ERROR_PATH = 'pages/api/auth/IndexController()'

async function IndexController(req: RequestWithPrisma, res: NextApiResponse) {
  if (req.method !== 'GET') {
    handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }

  const data = {
    version: VERSION,
  }

  res.status(200).json({ data })
}

export default IndexController
