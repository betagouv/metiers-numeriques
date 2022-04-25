import ß from 'bhala'
import Redis from 'ioredis'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  ß.error('`REDIS_URL` environment variable is undefined.')
  process.exit(1)
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const __REDIS = {
  redisInstance: new Redis(REDIS_URL),
}

export function getRedis(): Redis {
  return __REDIS.redisInstance
}
