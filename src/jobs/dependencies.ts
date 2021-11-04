import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { fakeJobs } from './__tests__/stubs/fakeJobs';
import { InstitutionsService, JobsService } from './interfaces';
import { InMemoryInstitutionsService } from './repository/inMemoryInstitutionService';
import { InMemoryJobsService } from './repository/inMemoryJobsService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const s = InMemoryJobsService;
s.feedWith(fakeJobs);
const jobsService: JobsService = s;

const i = InMemoryInstitutionsService;
i.feedWith(fakeInstitutions);
const institutionsService: InstitutionsService = i;

export {
    jobsService,
    institutionsService,
};
