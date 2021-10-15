// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
const { NotionMinistriesService } = require('./infrastructure/notionMinistriesService');
const {NotionService} = require('./infrastructure/notionJobsService');

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsRepository = NotionService;
const ministriesRepository = NotionMinistriesService;

module.exports = {
    jobsRepository,
    ministriesRepository,
};
