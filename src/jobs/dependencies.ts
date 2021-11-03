// const {InMemoryJobsService} = require('./infrastructure/InMemoryJobsRepository');
import { fakeJobs } from './__tests__/stubs/fakeJobs';
import { JobsService } from './interfaces';
import { InMemoryJobsService } from './repository/inMemoryJobsService';
// import { NotionMinistriesService } from './repository/notionMinistriesService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const s = InMemoryJobsService;
s.feedWith(fakeJobs);
const jobsService: JobsService = s;
// const ministriesService = NotionMinistriesService;

export {
    jobsService,
    // ministriesService,
};
