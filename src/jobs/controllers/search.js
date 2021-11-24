const Fuse = require('fuse.js')
const { stripHtml } = require('string-strip-html')

const cache = require('../../helpers/cache')
const { jobsRepository } = require('../dependencies')
const { dateReadableFormat } = require('../utils')

const getCachedJobs = async () =>
  cache.getOrCacheWith('jobs.index', async () => {
    const { jobs } = await jobsRepository.all()

    return jobs.map(job => ({
      ...job,
      departmentsAsText: job.department.map(department => stripHtml(department).result).join(', '),
    }))
  })

const search = async (req, res) => {
  const jobsIndex = await getCachedJobs()
  const fuse = new Fuse(jobsIndex, {
    keys: ['title'],
  })
  const foundJobs = fuse.search(req.query.query).map(({ item }) => item)

  res.render('partials/jobList', {
    contactEmail: 'contact@metiers.numerique.gouv.fr',
    dateReadableFormat,
    hasMore: false,
    jobs: foundJobs,
    nextCursor: req.query.nextCursor,
  })
}

module.exports = search
