const cache = require('../helpers/cache')
const handleError = require('../helpers/handleError')
const usecases = require('../jobs/usecases')
const { dateReadableFormat } = require('../jobs/utils')
const notionJob = require('../services/notionJob')

const getJob = async (req, res) => {
  try {
    const id = req.url.split('-').slice(-5).join('-').split('?')[0]

    const cachedResult = await cache.getOrCacheWith(`JOB.${id}`, async () => {
      const { tag } = req.query
      const job = await usecases.getJob(id, { jobsRepository: notionJob }, tag)

      return {
        job,
        pageDescription: job.mission || '',
        pageTitle: job.title,
      }
    })

    res.render('jobDetail', {
      ...cachedResult,
      dateReadableFormat,
    })
  } catch (err) {
    handleError(err, 'controllers/getJob()', res)
  }
}

module.exports = getJob
