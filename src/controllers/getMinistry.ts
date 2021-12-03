import { Request, Response } from 'express'
import * as R from 'ramda'

import { CACHE_KEY } from '../constants'
import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import uncapitalizeFirstLetter from '../helpers/uncapitalizeFirstLetter'
import data from '../services/data'

export default async function getMinistry(req: Request, res: Response) {
  try {
    const { id } = req.params

    const ministries = await cache.getOrCacheWith(CACHE_KEY.MINISTRIES, data.getMinistries)

    const maybeMinistry = R.find(R.propEq('id', id), ministries)
    if (maybeMinistry === undefined) {
      res.render('404')

      return
    }

    res.render('ministryDetail', {
      ministry: maybeMinistry,
      pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(maybeMinistry.fullName)}.`,
      pageTitle: maybeMinistry.title,
    })
  } catch (err) {
    handleError(err, 'controllers/getMinistry()', res)
  }
}
