/* eslint-disable */

import updateCache from '../jobs/updateCache'

;(async () => {
  await updateCache()

  process.exit()
})()
