// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
const {NotionJobsService} = require('./infrastructure/NotionJobsRepository')

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsRepository = NotionJobsService

module.exports = {
    jobsRepository,
}
