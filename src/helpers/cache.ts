import { createClient } from 'redis'

import handleError from './handleError'

const { REDIS_URL } = process.env
const CACHE_DURATION = process.env.CACHE_DURATION ? Number(process.env.CACHE_DURATION) : 60

const redisClient = createClient({
  url: REDIS_URL,
})

class Cache {
  /**
   * @param {string} key
   * @param {PromiseLike} cacheGetter
   * @param {number=} forInSeconds
   * @returns {Promise<any>}
   */
  async getOrCacheWith<T = any>(
    key: string,
    cacheGetter: () => Promise<T>,
    forInSeconds: number = CACHE_DURATION,
  ): Promise<T> {
    try {
      redisClient.on('error', err => handleError(err, 'helpers/Cache.getOrCacheWith()'))

      await redisClient.connect()

      const maybeCachedValueAsJson = await redisClient.get(key)

      if (maybeCachedValueAsJson !== null) {
        await redisClient.disconnect()

        const maybeCachedValue = JSON.parse(maybeCachedValueAsJson)

        return maybeCachedValue
      }

      const value = await cacheGetter()
      const valueAsJson = JSON.stringify(value)
      await redisClient.set(key, valueAsJson, {
        EX: forInSeconds,
      })
      await redisClient.disconnect()

      return value
    } catch (err) {
      return handleError(err, 'helpers/Cache.getOrCacheWith()')
    }
  }
}

export default new Cache()
