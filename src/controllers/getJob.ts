import cache from '../helpers/cache'
import generateJobFromNotionJob from '../helpers/generateJobFromNotionJob'
import generateJobFromNotionPepJob from '../helpers/generateJobFromNotionPepJob'
import generateJobFromNotionSkbJob from '../helpers/generateJobFromNotionSkbJob'
import handleError from '../helpers/handleError'
import notion from '../services/notion'
import { NotionJob } from '../types/NotionJob'
import { NotionPepJob } from '../types/NotionPepJob'
import { NotionSkbJob } from '../types/NotionSkbJob'

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
      switch (type) {
        case 'NOTION_JOB':
          job = generateJobFromNotionJob(notionJob as NotionJob)
          break

        case 'NOTION_PEP_JOB':
          job = generateJobFromNotionPepJob(notionJob as NotionPepJob)
          break

        case 'NOTION_SKB_JOB':
          job = generateJobFromNotionSkbJob(notionJob as NotionSkbJob)
          break

        default:
          throw new Error(`This Notion job type (${type}) is not supported.`)
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
