const Fuse = require('fuse.js')
const redis = require('redis')
const { stripHtml } = require('string-strip-html')
const { promisify } = require('util')

const { jobsRepository } = require('../dependencies')
const { dateReadableFormat } = require('../utils')

const { NODE_ENV, REDIS_URL } = process.env
const ONE_HOUR_IN_SECONDS = NODE_ENV !== 'development' ? 60 * 60 : 15

const redisClient = redis.createClient({
  url: REDIS_URL,
})
const redisClientGet = promisify(redisClient.get).bind(redisClient)
const redisClientSet = promisify(redisClient.set).bind(redisClient)

const getCachedJobs = async () => {
  const maybeCachedJobsIndexAsJson = await redisClientGet('jobs.index')
  if (maybeCachedJobsIndexAsJson !== null) {
    const jobs = JSON.parse(maybeCachedJobsIndexAsJson)

    return jobs
  }

  const { jobs } = await jobsRepository.all()
  const jobsIndex = jobs.map(job => ({
    ...job,
    departmentsAsText: job.department.map(department => stripHtml(department).result).join(', '),
  }))
  const jobsIndexAsJson = JSON.stringify(jobsIndex)
  await redisClientSet('jobs.index', jobsIndexAsJson, 'EX', ONE_HOUR_IN_SECONDS)

  return jobsIndex
}

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
