import { Request, Response } from 'express'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import stripHtmlTags from '../helpers/stripHtmlTags'
import data from '../services/data'

export default async function getJobs(req: Request, res: Response) {
  try {
    const jobs = await cache.getOrCacheWith(CACHE_KEY.JOBS, data.getJobs)

    const view = req.query.isUpdate ? 'partials/jobList' : 'jobs'

    res.render(view, {
      helper: {
        stripHtmlTags,
      },
      jobs,
      pageDescription:
        'Découvrez l’ensemble des offres d’emploi numériques proposées par les services de l’État ' +
        'et les administrations territoriales.',
      pageTitle: 'Liste des offres d’emploi numériques de l’État',
    })
  } catch (err) {
    handleError(err, 'controllers/getJobs()', res)
  }
}
