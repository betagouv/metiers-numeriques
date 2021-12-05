import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import uncapitalizeFirstLetter from '../helpers/uncapitalizeFirstLetter'
import data from '../services/data'

export default async function getInstitution(req: Request, res: Response) {
  try {
    const institutions = await cache.getOrCacheWith(CACHE_KEY.INSTITUTIONS, data.getInstitutions)

    const maybeInstitution = R.find(R.propEq('slug', req.params.slug), institutions)
    if (maybeInstitution === undefined) {
      res.status(404).render('404')

      return
    }

    res.render('institutionDetail', {
      institution: maybeInstitution,
      pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(maybeInstitution.fullName)}.`,
      pageTitle: maybeInstitution.title,
      selectedMenu: 'institutions',
    })
  } catch (err) {
    handleError(err, 'controllers/getInstitution()', res)
  }
}
