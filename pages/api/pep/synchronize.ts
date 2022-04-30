import { ApiError } from '@api/libs/ApiError'
import { handleError } from '@common/helpers/handleError'
import ß from 'bhala'

import type { NextApiRequest, NextApiResponse } from 'next'

const { API_SECRET } = process.env
const SCRIPT_PATH = 'pages/api/pep/synchronize.js'

export default async function ApiPepSynchronizeEndpoint(req: NextApiRequest, res: NextApiResponse) {
  if (API_SECRET === undefined) {
    throw new Error('`API_SECRET` is undefined.')
  }
  if (req.method !== 'GET') {
    return handleError(new ApiError('Method not allowed.', 405, true), SCRIPT_PATH, res)
  }
  if (req.headers['x-api-secret'] === undefined) {
    return handleError(new ApiError('Unauthorized.', 401, true), SCRIPT_PATH, res)
  }
  if (req.headers['x-api-secret'] !== API_SECRET) {
    return handleError(new ApiError('Forbidden.', 403, true), SCRIPT_PATH, res)
  }

  try {
    res.json({
      data: {
        count: 0,
      },
      hasError: false,
    })
  } catch (err) {
    ß.error(`[${SCRIPT_PATH}] ${err}`)

    return handleError(err, SCRIPT_PATH, res)
  }
}
