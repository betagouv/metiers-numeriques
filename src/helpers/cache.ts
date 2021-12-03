import dayjs from 'dayjs'
import * as R from 'ramda'
import { createClient } from 'redis'

import handleError from './handleError'

const { NODE_ENV, REDIS_URL } = process.env
const CACHE_DURATION = process.env.CACHE_DURATION ? Number(process.env.CACHE_DURATION) : 60

const redisClient = createClient({
  url: REDIS_URL,
})

type CacheValue<T> = {
  data: T
  /** ISO date */
  updatedAt: string
}

class Cache {
  private inProgressCachingKeys: string[] = []

  public async getOrCacheWith<T = any>(key: string, cacheGetter: () => Promise<T>): Promise<T> {
    try {
      redisClient.on('error', err => handleError(err, 'helpers/Cache.getOrCacheWith()'))

      if (!redisClient.isOpen) {
        await redisClient.connect()
      }
      const maybeCachedValueAsJson = await redisClient.get(key)

      if (maybeCachedValueAsJson !== null && NODE_ENV === 'production') {
        const maybeCachedValue = JSON.parse(maybeCachedValueAsJson) as CacheValue<T>

        return maybeCachedValue.data
      }

      const data = await cacheGetter()
      await this.set(key, data)

      return data
    } catch (err) {
      return handleError(err, 'helpers/Cache.getOrCacheWith()')
    }
  }

  public async set<T>(key: string, data: T): Promise<void> {
    try {
      if (this.inProgressCachingKeys.includes(key)) {
        return
      }

      this.inProgressCachingKeys.push(key)

      const updatedAt = dayjs().toISOString()
      const value: CacheValue<T> = {
        data,
        updatedAt,
      }
      const valueAsJson = JSON.stringify(value)

      if (!redisClient.isOpen) {
        await redisClient.connect()
      }
      await redisClient.set(key, valueAsJson)

      this.inProgressCachingKeys = R.without([key])(this.inProgressCachingKeys)
    } catch (err) {
      return handleError(err, 'helpers/Cache.set()')
    }
  }

  public async shouldUpdate(key: string): Promise<boolean> {
    try {
      if (this.inProgressCachingKeys.includes(key)) {
        return false
      }

      if (!redisClient.isOpen) {
        await redisClient.connect()
      }
      const maybeCachedValueAsJson = await redisClient.get(key)
      if (maybeCachedValueAsJson === null) {
        return true
      }

      const { updatedAt } = JSON.parse(maybeCachedValueAsJson) as CacheValue<any>

      const cacheAgeInSeconds = dayjs().diff(dayjs(updatedAt), 'second')

      return cacheAgeInSeconds > CACHE_DURATION
    } catch (err) {
      return handleError(err, 'helpers/Cache.shouldUpdate()')
    }
  }
}

export default new Cache()
