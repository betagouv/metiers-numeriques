/* eslint-disable class-methods-use-this */

const redis = require('redis')
const { promisify } = require('util')

const { NODE_ENV, REDIS_URL } = process.env
const ONE_HOUR_IN_SECONDS = NODE_ENV !== 'development' ? 60 * 60 : 15

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
  async getOrCacheWith(key, cacheGetter, forInSeconds = ONE_HOUR_IN_SECONDS) {
    const maybeCachedValueAsJson = await redisClientGet(key)
    if (maybeCachedValueAsJson !== null) {
      const maybeCachedValue = JSON.parse(maybeCachedValueAsJson)

      return maybeCachedValue
    }

    const value = await cacheGetter()
    const valueAsJson = JSON.stringify(value)
    await redisClientSet(key, valueAsJson, 'EX', forInSeconds)

    return value
  }
}

module.exports = new Cache()
