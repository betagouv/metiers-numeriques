import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import generateJobStructuredData from '../helpers/generateJobStructuredData'
import handleError from '../helpers/handleError'
import Job from '../models/Job'
import data from '../services/data'

export default async function getJob(req: Request, res: Response) {
  try {
    const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)

    const maybeJob = R.find<Job>(R.propEq('slug', req.params.slug), jobs)
    if (maybeJob === undefined) {
      res.status(404).render('job404')

      return
    }

    const structuredData = generateJobStructuredData(maybeJob)

    res.render('jobDetail', {
      job: maybeJob,
      pageDescription: maybeJob.mission || '',
      pageTitle: maybeJob.title,
      selectedMenu: 'jobs',
      structuredData,
    })
  } catch (err) {
    handleError(err, 'controllers/getJob()', res)
  }
}
