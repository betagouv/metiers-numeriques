import ß from 'bhala'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

async function updateEntities(isForced: boolean): Promise<void> {
  try {
    if (!isForced && !(await cache.shouldUpdate(CACHE_KEY.ENTITIES))) {
      return
    }

    ß.debug(`[jobs/updateCache.js] Caching entities…`)
    const entities = await data.getEntities()
    await cache.set(CACHE_KEY.ENTITIES, entities)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateEntities()')
  }
}

async function updateInstitutions(isForced: boolean): Promise<void> {
  try {
    if (!isForced && !(await cache.shouldUpdate(CACHE_KEY.INSTITUTIONS))) {
      return
    }

    ß.debug(`[jobs/updateCache.js] Caching institutions…`)
    const institutions = await data.getInstitutions()
    await cache.set(CACHE_KEY.INSTITUTIONS, institutions)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateInstitutions()')
  }
}

async function updateServices(isForced: boolean): Promise<void> {
  try {
    if (!isForced && !(await cache.shouldUpdate(CACHE_KEY.SERVICES))) {
      return
    }

    ß.debug(`[jobs/updateCache.js] Caching services…`)
    const services = await data.getServices()
    await cache.set(CACHE_KEY.SERVICES, services)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateServices()')
  }
}

async function updateJobs(isForced: boolean): Promise<void> {
  try {
    if (!isForced && !(await cache.shouldUpdate(CACHE_KEY.JOBS))) {
      return
    }

    ß.debug(`[jobs/updateCache.js] Caching jobs…`)
    const jobs = await data.getJobs()
    await cache.set(CACHE_KEY.JOBS, jobs)
  } catch (err) {
    handleError(err, 'jobs/updateCache#updateJobs()')
  }
}

export default async function updateCache(isForced: boolean = false): Promise<void> {
  try {
    await updateInstitutions(isForced)

    await updateEntities(isForced)
    await updateServices(isForced)
    await updateJobs(isForced)
  } catch (err) {
    handleError(err, 'jobs/updateCache()')
  }
}
