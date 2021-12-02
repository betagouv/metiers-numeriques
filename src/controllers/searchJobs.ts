import { Request, Response } from 'express'
import Fuse from 'fuse.js'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import stripHtmlTags from '../helpers/stripHtmlTags'
import data from '../services/data'

export default async function searchJobs(req: Request, res: Response) {
  try {
    const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)
    const fusedJobs = new Fuse(jobs, {
      includeScore: true,
      keys: ['title'],
    })
    const foundJobs = fusedJobs
      .search(req.query.query as string)
      .filter(({ score }) => score !== undefined && score < 0.75)
      .map(({ item }) => item)

    res.render('partials/jobList', {
      hasMore: false,
      helper: {
        stripHtmlTags,
      },
      jobs: foundJobs,
      nextCursor: req.query.nextCursor,
    })
  } catch (err) {
    handleError(err, 'controllers/searchJobs()', res)
  }
}
