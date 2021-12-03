import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

export default async function getJob(req: Request, res: Response) {
  try {
    const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)

    const maybeJob = R.find(R.propEq('slug', req.params.slug), jobs)
    if (maybeJob === undefined) {
      res.render('404')

      return
    }

    res.render('jobDetail', {
      job: maybeJob,
      pageDescription: maybeJob.mission || '',
      pageTitle: maybeJob.title,
      selectedMenu: 'jobs',
    })
  } catch (err) {
    handleError(err, 'controllers/getJob()', res)
  }
}
