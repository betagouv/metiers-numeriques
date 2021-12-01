const ß = require('bhala')
const { createClient } = require('redis')

const { REDIS_URL } = process.env

const redisClient = createClient({
  url: REDIS_URL,
})

async function purgeRedisCache() {
  try {
    ß.info('[scripts/purgeRedisCache.js]', 'Purging Redis cache…')

    await redisClient.connect()
    await redisClient.flushAll()
    await redisClient.disconnect()

    ß.success('[scripts/purgeRedisCache.js]', 'Redis cache purged.')
  } catch (err) {
    ß.error('[scripts/purgeRedisCache.js]', String(err))
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

purgeRedisCache()
