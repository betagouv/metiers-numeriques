import Fuse from 'fuse.js'
import { stripHtml } from 'string-strip-html'

import cache from '../helpers/cache'
import generateJobFromNotionJobData from '../helpers/generateJobFromNotionJobData'
import handleError from '../helpers/handleError'
import { dateReadableFormat } from '../legacy/utils'
import notion from '../services/notion'

const getCachedJobsIndex = async () =>
  cache.getOrCacheWith('JOBS.SEARCH_INDEX', async () => {
    const notionJobs = await notion.findManyJobs()
    const jobs = notionJobs.map(generateJobFromNotionJobData)
    console.log(jobs)
    const jobsIndex = jobs.map(job => ({
      ...job,
      departmentsAsText: job.department.map(department => stripHtml(department).result).join(', '),
    }))

    return jobsIndex
  })

const searchJobs = async (req, res) => {
  try {
    const jobsIndex = await getCachedJobsIndex()
    const fusedJobs = new Fuse(jobsIndex, {
      includeScore: true,
      keys: ['title'],
    })
    const foundJobs = fusedJobs
      .search(req.query.query)
      .filter(({ score }) => score !== undefined && score < 0.75)
      .map(({ item }) => item)

    res.render('partials/jobList', {
      dateReadableFormat,
      hasMore: false,
      jobs: foundJobs,
      nextCursor: req.query.nextCursor,
    })
  } catch (err) {
    handleError(err, 'controllers/searchJobs()', res)
  }
}

export default searchJobs
