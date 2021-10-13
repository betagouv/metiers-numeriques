// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
const {NotionService} = require('./infrastructure/notionJobsService');

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsRepository = NotionService;

module.exports = {
    jobsRepository,
};
