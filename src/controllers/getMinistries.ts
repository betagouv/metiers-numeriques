import { Request, Response } from 'express'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

export default async function getMinistries(req: Request, res: Response) {
  try {
    const ministries = await cache.getOrCacheWith(CACHE_KEY.MINISTRIES, data.getMinistries)

    res.render('ministries', {
      ministries,
      pageDescription: 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.',
      pageTitle: 'Liste des entités numériques de l’État',
    })
  } catch (err) {
    handleError(err, 'controllers/getMinistries()', res)
  }
}
