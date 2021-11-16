import { database } from '../database';
import { UuidGenerator, uuidGeneratorFactory } from '../shared/uuidGenerator';
import { InstitutionsRepository, JobsRepositoy } from './interfaces';
import { PgInstitutionsRepository } from './repository/PgInstitutionsRepository';
import { PgJobsRepository } from './repository/PgJobsRepository';

// const jobsService: JobsService = InMemoryJobsService.feedWith(fakeJobs);
// const institutionsService: InstitutionsService = InMemoryInstitutionsService.feedWith(fakeInstitutions);
const jobsService: JobsRepositoy = PgJobsRepository(database);
const institutionsService: InstitutionsRepository = PgInstitutionsRepository(database);

const uuidGenerator: UuidGenerator = uuidGeneratorFactory()

export {
    jobsService,
    institutionsService,
    uuidGenerator
};
