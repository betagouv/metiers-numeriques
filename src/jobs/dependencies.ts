// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
import { NotionService } from './infrastructure/notionJobsService';
import { NotionMinistriesService } from './infrastructure/notionMinistriesService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsService = NotionService;
const ministriesService = NotionMinistriesService;

export {
    jobsService,
    ministriesService,
};
