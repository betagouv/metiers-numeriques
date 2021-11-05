import { UuidGenerator, uuidGeneratorFactory } from '../shared/uuidGenerator';
import { fakeInstitutions } from './__tests__/stubs/fakeInstitutions';
import { fakeJobs } from './__tests__/stubs/fakeJobs';
import { InstitutionsService, JobsService } from './interfaces';
import { InMemoryInstitutionsService } from './repository/inMemoryInstitutionService';
import { InMemoryJobsService } from './repository/inMemoryJobsService';

// const jobsRepository = process.env.NODE_ENV === 'production' ? NotionJobsService : InMemoryJobsService
const jobsService: JobsService = InMemoryJobsService.feedWith(fakeJobs);
const institutionsService: InstitutionsService = InMemoryInstitutionsService.feedWith(fakeInstitutions);

const uuidGenerator: UuidGenerator = uuidGeneratorFactory()

export {
    jobsService,
    institutionsService,
    uuidGenerator
};
