const redis = require('redis')
const { promisify } = require('util')

const handleError = require('./handleError')

const { REDIS_URL } = process.env
const CACHE_DURATION = process.env.CACHE_DURATION ? Number(process.env.CACHE_DURATION) : 60

const redisClient = redis.createClient({
  url: REDIS_URL,
})

const redisClientGet = promisify(redisClient.get).bind(redisClient)
const redisClientSet = promisify(redisClient.set).bind(redisClient)

class Cache {
  /**
   * @param {string} key
   * @param {PromiseLike} cacheGetter
   * @param {number=} forInSeconds
   * @returns {Promise<any>}
   */
  async getOrCacheWith(key, cacheGetter, forInSeconds = CACHE_DURATION) {
    try {
      const maybeCachedValueAsJson = await redisClientGet(key)
      if (maybeCachedValueAsJson !== null) {
        const maybeCachedValue = JSON.parse(maybeCachedValueAsJson)

        return maybeCachedValue
      }

      const value = await cacheGetter()
      const valueAsJson = JSON.stringify(value)
      await redisClientSet(key, valueAsJson, 'EX', forInSeconds)

      return value
    } catch (err) {
      handleError(err, 'helpers/Cache.getOrCacheWith()')
    }
  }
}

module.exports = new Cache()
