import ApiError from '@api/libs/ApiError'
import { USER_ROLE } from '@common/constants'
import handleError from '@common/helpers/handleError'
import { getUser } from 'nexauth'

import type { NextApiRequest, NextApiResponse } from 'next'

const ERROR_PATH = 'pages/api/sync.js'

export default async function ApiGraphqlEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return handleError(new ApiError('Method not allowed.', 405, true), ERROR_PATH, res)
  }

  const user = await getUser<Common.Auth.User>(req)
  if (user === undefined) {
    return handleError(new ApiError('Unauthorized.', 401, true), ERROR_PATH, res)
  }
  if (user.role !== USER_ROLE.ADMINISTRATOR) {
    return handleError(new ApiError('Forbidden.', 403, true), ERROR_PATH, res)
  }

  res.json({})
}
