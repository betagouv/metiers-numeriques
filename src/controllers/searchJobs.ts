import { Request, Response } from 'express'
import Fuse from 'fuse.js'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import normalizeJobDescription from '../helpers/normalizeJobDescription'
import Job from '../models/Job'
import data from '../services/data'

const filterJobsByQuery = (jobs: Job[], query: string): Job[] => {
  if (query.length === 0) {
    return jobs
  }

  const extendedQuery = query.replace(/(^| )/g, "'")

  const fusedJobs = new Fuse(jobs, {
    includeScore: true,
    keys: ['title'],
  })
  const foundJobs = fusedJobs
    .search(extendedQuery)
    .filter(({ score }) => score !== undefined && score < 0.75)
    .map(({ item }) => item)

  return foundJobs
}

const filterJobsByRegion = (jobs: Job[], region: string): Job[] => {
  if (region.length === 0) {
    return jobs
  }

  return jobs.filter(({ service }) => service?.region === region)
}

export default async function searchJobs(req: Request, res: Response) {
  try {
    const { query, region } = req.query
    if (typeof query !== 'string' || typeof region !== 'string') {
      res.render('partials/jobList', {
        helper: {
          normalizeJobDescription,
        },
        jobs: [],
      })

      return
    }

    const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)
    const jobsFilteredByRegion = filterJobsByRegion(jobs, region)
    const jobsFilteredByQuery = filterJobsByQuery(jobsFilteredByRegion, query)

    const fromIndex = !Number.isNaN(Number(req.query.fromIndex)) ? Number(req.query.fromIndex) : 0
    const someJobs = jobsFilteredByQuery.slice(fromIndex, fromIndex + 10)

    res.render('partials/jobList', {
      helper: {
        normalizeJobDescription,
      },
      jobs: someJobs,
    })
  } catch (err) {
    handleError(err, 'controllers/searchJobs()', res)
  }
}
