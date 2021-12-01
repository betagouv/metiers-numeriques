import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import notionMinistry from '../services/notionMinistry'

const getMinistries = async (req, res) => {
  try {
    const cachedResult = await cache.getOrCacheWith('MINISTRY.ALL', async () => {
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

export default getMinistries
