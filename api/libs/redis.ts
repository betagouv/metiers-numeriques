import { B } from 'bhala'
import Redis from 'ioredis'

const { REDIS_URL } = process.env
if (REDIS_URL === undefined) {
  B.error('`REDIS_URL` environment variable is undefined.')
  process.exit(1)
}

const redis = new Redis(REDIS_URL)

export { redis }
