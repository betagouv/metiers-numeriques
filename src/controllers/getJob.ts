import cache from '../helpers/cache'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import handleError from '../helpers/handleError'
import notion from '../services/notion'
import { NotionJob } from '../types/NotionJob'
import { NotionPepJob } from '../types/NotionPepJob'

const getJob = async (req, res) => {
  try {
    const jobId = req.url.split('-').slice(-5).join('-').split('?')[0]

    const cachedResult = await cache.getOrCacheWith(`JOB.${jobId}`, async () => {
      const maybeNotionPage = await notion.page.findById(jobId)

      if (maybeNotionPage === null) {
        return null
      }

      const { data: notionJob, type } = maybeNotionPage

      let job
      if (type === 'NOTION_JOB') {
        job = generateJobFromNotionJob(notionJob as NotionJob)
      }
      if (type === 'NOTION_PEP_JOB') {
        job = generateJobFromNotionPepJob(notionJob as NotionPepJob)
      }

      return {
        job,
        pageDescription: job.mission || '',
        pageTitle: job.title,
      }
    })

    if (cachedResult === null) {
      res.render('404')

      return
    }

    res.render('jobDetail', cachedResult)
  } catch (err) {
    handleError(err, 'controllers/getJob()', res)
  }
}

export default getJob
