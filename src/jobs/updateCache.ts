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

async function updateMinistries(): Promise<void> {
  try {
    if (!(await cache.shouldUpdate(CACHE_KEY.MINISTRIES))) {
      return
    }

    ß.info(`[jobs/updateCache.js] Caching ministries…`)
    const ministries = await data.getMinistries()
    await cache.set(CACHE_KEY.MINISTRIES, ministries)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateMinistries()')
  }
}

export default async function updateCache(): Promise<void> {
  try {
    await updateJobs()
    await updateMinistries()
  } catch (err) {
    handleError(err, 'jobs/updateCache()')
  }
}
