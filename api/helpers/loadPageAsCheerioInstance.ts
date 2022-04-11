import cheerio from 'cheerio'
import ky, { TimeoutError } from 'ky-universal'

import type { CheerioAPI } from 'cheerio'

const MAX_RETRIES_COUNT = 5
const TIMEOUT = 30 * 1000

export async function loadPageAsCheerioInstance(path: string, retriesCount = 1): Promise<CheerioAPI> {
  try {
    const response = await ky.get(path, {
      retry: {
        limit: MAX_RETRIES_COUNT,
      },
      timeout: TIMEOUT,
    })
    const sourceAsHtml = await response.text()
    const $root = cheerio.load(sourceAsHtml)

    return $root
  } catch (err) {
    if (err instanceof TimeoutError) {
      if (retriesCount === MAX_RETRIES_COUNT) {
        throw err
      }

      return loadPageAsCheerioInstance(path, retriesCount + 1)
    }

    return undefined as never
  }
}
