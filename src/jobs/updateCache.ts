import ß from 'bhala'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

async function updateJobs(): Promise<void> {
  try {
    if (!(await cache.shouldUpdate(CACHE_KEY.JOBS))) {
      return
    }

    ß.info(`[jobs/updateCache.js] Caching jobs…`)
    const jobs = await data.getJobs()
    await cache.set(CACHE_KEY.JOBS, jobs)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateJobs()')
  }
}

export default async function updateCache(): Promise<void> {
  try {
    await updateJobs()
  } catch (err) {
    handleError(err, 'jobs/updateCache()')
  }
}
