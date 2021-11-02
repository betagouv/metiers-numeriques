// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
import { JobsService } from './interfaces';
import { NotionService } from './repository/notionJobsService';
import { NotionMinistriesService } from './repository/notionMinistriesService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsService: JobsService = NotionService;
const ministriesService = NotionMinistriesService;

export {
    jobsService,
    ministriesService,
};
