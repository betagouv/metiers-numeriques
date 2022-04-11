import handleError from '@common/helpers/handleError'

import type { NextApiRequest } from 'next'

export function getApiSecretFromNextRequest(req: NextApiRequest): string | undefined {
  try {
    const { 'x-api-secret': apiSecret } = req.headers

    if (typeof apiSecret !== 'string') {
      return undefined
    }

    return apiSecret
  } catch (err) {
    handleError(err, 'libs/getUser()', true)
  }
}
