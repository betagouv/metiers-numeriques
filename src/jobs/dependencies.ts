// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
import { JobsService } from './interfaces';
import { InMemoryJobsService } from './repository/inMemoryJobsService';
// import { NotionMinistriesService } from './repository/notionMinistriesService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsService: JobsService = InMemoryJobsService;
// const ministriesService = NotionMinistriesService;

export {
    jobsService,
    // ministriesService,
};
