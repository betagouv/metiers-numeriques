const Fuse = require('fuse.js')
const redis = require('redis')
const { stripHtml } = require('string-strip-html')
const { promisify } = require('util')

const { jobsRepository } = require('../jobs/dependencies')

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
    departmentsAsText: job.department.map(department => stripHtml(department).result).join(', '),
    experiences: job.experiences,
    locations: job.locations,
    mission: job.mission,
    openedToContractTypes: job.openedToContractTypes,
    publicationDate: job.publicationDate,
    slug: job.slug,
    title: job.title,
  }))
  console.log(jobsIndex)
  const jobsIndexAsJson = JSON.stringify(jobsIndex)
  await redisClientSet('jobs.index', jobsIndexAsJson, 'EX', ONE_HOUR_IN_SECONDS)

  return jobsIndex
}

module.exports.jobs = {
  search: async (req, res) => {
    const jobsIndex = await getCachedJobs()
    const fuse = new Fuse(jobsIndex, {
      keys: [
        {
          name: 'title',
          weight: 0.5,
        },
        {
          name: 'departmentsAsText',
          weight: 0.5,
        },
      ],
    })
    const foundJobs = fuse.search(req.params.query)

    res
      .status(200)
      .json({
        jobs: foundJobs,
      })
      .end()
  },
}
