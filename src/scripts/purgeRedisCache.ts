import ß from 'bhala'

import cache from '../helpers/cache'

async function purgeRedisCache() {
  try {
    ß.info('[scripts/purgeRedisCache.js]', 'Purging Redis cache…')

    await cache.purge()

    ß.success('[scripts/purgeRedisCache.js]', 'Redis cache purged.')
    process.exit()
  } catch (err) {
    ß.error('[scripts/purgeRedisCache.js]', String(err))
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

purgeRedisCache()
