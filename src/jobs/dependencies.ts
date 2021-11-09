import { database } from '../database';
import { UuidGenerator, uuidGeneratorFactory } from '../shared/uuidGenerator';
import { InstitutionsService, JobsService } from './interfaces';
import { PgInstitutionsServiceFactory } from './repository/PgInstitutionsService';
import { PgJobsServiceFactory } from './repository/PgJobsService';

// const jobsService: JobsService = InMemoryJobsService.feedWith(fakeJobs);
// const institutionsService: InstitutionsService = InMemoryInstitutionsService.feedWith(fakeInstitutions);
const jobsService: JobsService = PgJobsServiceFactory(database);
const institutionsService: InstitutionsService = PgInstitutionsServiceFactory(database);

const uuidGenerator: UuidGenerator = uuidGeneratorFactory()

export {
    jobsService,
    institutionsService,
    uuidGenerator
};
