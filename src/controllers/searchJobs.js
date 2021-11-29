const Fuse = require('fuse.js')
const { stripHtml } = require('string-strip-html')

const cache = require('../helpers/cache')
const handleError = require('../helpers/handleError')
const { dateReadableFormat } = require('../jobs/utils')
const notionJob = require('../services/notionJob')

const getCachedJobs = async () =>
  cache.getOrCacheWith('JOBS.SEARCH_INDEX', async () => {
    const { jobs } = await notionJob.all()

    const jobsIndex = jobs.map(job => ({
      ...job,
      departmentsAsText: job.department.map(department => stripHtml(department).result).join(', '),
    }))

    const fusedJobs = new Fuse(jobsIndex, {
      includeScore: true,
      keys: ['title'],
    })

    return fusedJobs
  })

const searchJobs = async (req, res) => {
  try {
    const fusedJobs = await getCachedJobs()
    const foundJobs = fusedJobs
      .search(req.query.query)
      .filter(({ score }) => score < 0.75)
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

module.exports = searchJobs
