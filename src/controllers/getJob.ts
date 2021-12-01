import cache from '../helpers/cache'
import handleError from '../helpers/handleError'
import usecases from '../legacy/usecases'
import { dateReadableFormat } from '../legacy/utils'
import notionJob from '../services/notionJob'

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

export default getJob
