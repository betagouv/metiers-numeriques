import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import Institution from '../models/Institution'
import data from '../services/data'

const filterPublishedInstitutions: (insitutions: Institution[]) => Institution[] = R.filter(
  R.propEq('isPublished', true),
)

export default async function getInstitutions(req: Request, res: Response) {
  try {
    const institutions = await cache.getOrCacheWith(CACHE_KEY.INSTITUTIONS, data.getInstitutions)
    const publishedInstitutions = filterPublishedInstitutions(institutions)

    res.render('institutions', {
      institutions: publishedInstitutions,
      pageDescription: 'Découvrez l’ensemble des entités numériques des ministères et services de l’État.',
      pageTitle: 'Liste des entités numériques de l’État',
      selectedMenu: 'institutions',
    })
  } catch (err) {
    handleError(err, 'controllers/getInstitutions()', res)
  }
}
