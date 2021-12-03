import ß from 'bhala'
import dayjs from 'dayjs'
import * as R from 'ramda'
import { createClient } from 'redis'

import handleError from './handleError'

const { REDIS_URL } = process.env
const CACHE_DURATION = process.env.CACHE_DURATION ? Number(process.env.CACHE_DURATION) : 60

type CacheValue<T> = {
  data: T
  /** ISO date */
  updatedAt: string
}

class Cache {
  private inProgressCachingKeys: string[] = []
  private redisClient = createClient({
    url: REDIS_URL,
  })

  constructor() {
    try {
      this.redisClient.on('error', async err => {
        try {
          ß.error(`[helpers/Cache.constructor() | Redis Error] ${err}`)
          ß.error(`[helpers/Cache.constructor() | Redis Error] Trying to recover…`)

          if (!this.redisClient.isOpen) {
            this.redisClient.connect()
          }
        } catch (err) {
          handleError(err, 'helpers/Cache.constructor() | Redis Error')
        }
      })
    } catch (err) {
      handleError(err, 'helpers/Cache.constructor()')
    }
  }

  public async getOrCacheWith<T = any>(key: string, cacheGetter: () => Promise<T>): Promise<T> {
    try {
      if (!this.redisClient.isOpen) {
        await this.redisClient.connect()
      }
      const maybeCachedValueAsJson = await this.redisClient.get(key)
      await this.redisClient.quit()

      if (maybeCachedValueAsJson !== null) {
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

      if (!this.redisClient.isOpen) {
        await this.redisClient.connect()
      }
      await this.redisClient.set(key, valueAsJson)
      await this.redisClient.quit()

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

      if (!this.redisClient.isOpen) {
        await this.redisClient.connect()
      }
      const maybeCachedValueAsJson = await this.redisClient.get(key)
      await this.redisClient.quit()
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
