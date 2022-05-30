/**
 * @jest-environment node
 */

import { getApiSecretFromNextRequest } from '../getApiSecretFromNextRequest'

import type { NextApiRequest } from 'next'

describe('api/helpers/getApiSecretFromNextRequest()', () => {
  test(`with an existing "x-api-secret" header`, async () => {
    const req = {
      headers: {
        'x-api-secret': 'aSecret',
      },
    } as unknown as NextApiRequest

    const result = getApiSecretFromNextRequest(req)

    expect(result).toStrictEqual('aSecret')
  })

  test(`with a missing "x-api-secret" header`, async () => {
    const req = {
      headers: {},
    } as unknown as NextApiRequest

    const result = getApiSecretFromNextRequest(req)

    expect(result).toBeUndefined()
  })
})
