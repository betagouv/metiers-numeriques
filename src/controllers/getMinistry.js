const cache = require('../helpers/cache')
const handleError = require('../helpers/handleError')
const uncapitalizeFirstLetter = require('../helpers/uncapitalizeFirstLetter')
const notionMinistry = require('../services/notionMinistry')

const getMinistry = async (req, res) => {
  try {
    const { id } = req.params
    const cachedResult = await cache.getOrCacheWith(`MINISTRY.${id}`, async () => {
      const ministry = await notionMinistry.getOneById(id)

      return {
        ministry,
        pageDescription: `Tout savoir sur ${uncapitalizeFirstLetter(ministry.fullName)}.`,
        pageTitle: ministry.title,
      }
    })

    res.render('ministryDetail', cachedResult)
  } catch (err) {
    handleError(err, 'controllers/getMinistry()', res)
  }
}

module.exports = getMinistry
