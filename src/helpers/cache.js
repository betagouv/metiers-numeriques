const { createClient } = require('redis')

const handleError = require('./handleError')

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
  async getOrCacheWith(key, cacheGetter, forInSeconds = CACHE_DURATION) {
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
      await redisClient.set(key, valueAsJson, 'EX', forInSeconds)
      await redisClient.disconnect()

      return value
    } catch (err) {
      handleError(err, 'helpers/Cache.getOrCacheWith()')
    }
  }
}

module.exports = new Cache()
