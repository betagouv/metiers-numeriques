import ß from 'bhala'

import updateCache from '../jobs/updateCache'

async function runCacheUpdate() {
  try {
    ß.info('[scripts/runCacheUpdate.js]', 'Updating Redis cache…')

    await updateCache()

    ß.success('[scripts/runCacheUpdate.js]', 'Redis cache updated.')
    process.exit()
  } catch (err) {
    ß.error('[scripts/runCacheUpdate.js]', String(err))
    // eslint-disable-next-line no-console
    console.error(err)
    process.exit(1)
  }
}

runCacheUpdate()
