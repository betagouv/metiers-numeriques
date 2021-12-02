import { Request, Response } from 'express'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import notionMinistry from '../services/notionMinistry'

export default async function getMinistries(req: Request, res: Response) {
  try {
    const cachedResult = await cache.getOrCacheWith(CACHE_KEY.MINISTRIES, async () => {
      const ministries = await notionMinistry.getAll()

      return {
        ministries,
        pageDescription: 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.',
        pageTitle: 'Liste des entités numériques de l’État',
      }
    })

    res.render('ministries', cachedResult)
  } catch (err) {
    handleError(err, 'controllers/getMinistries()', res)
  }
}
