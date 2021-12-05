import { Request, Response } from 'express'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import data from '../services/data'

export default async function getInstitutions(req: Request, res: Response) {
  try {
    const institutions = await cache.getOrCacheWith(CACHE_KEY.INSTITUTIONS, data.getInstitutions)

    res.render('institutions', {
      institutions,
      pageDescription: 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.',
      pageTitle: 'Liste des entités numériques de l’État',
      selectedMenu: 'institutions',
    })
  } catch (err) {
    handleError(err, 'controllers/getInstitutions()', res)
  }
}
