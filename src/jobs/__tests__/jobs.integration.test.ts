import { database } from '../../database';
import { JobModel } from '../../knex/models';
import { UuidGenerator, uuidGeneratorFactory } from '../../shared/uuidGenerator';
import { PgJobsServiceFactory } from '../repository/PgJobsService';
import { fakeJobs } from './stubs/fakeJobs';

describe('Listing job', () => {
    let jobsService = PgJobsServiceFactory(database);
    let uuidGenerator: UuidGenerator;

    beforeEach(() => {
        // seed db
        uuidGenerator = uuidGeneratorFactory("407ccaa8-9812-4abe-a8b3-fc88e5b1b993");
    });

    afterAll(() => {
        database.destroy()
    })


    it.skip('should get the job list', async () => {
        const result = await jobsService.list({});
        expect(result.jobs.length).toEqual(2);
    });

    it.skip('should get one job detail', async () => {
        const result = await jobsService.get('uuid');
        expect(result).toBeDefined();
    });

    it('should save a job', async () => {
        const job = {
            ...fakeJobs[0],
            uuid: uuidGenerator(),
            institutionId: uuidGenerator(),
        };
        await jobsService.add(job);
        const result = await database<JobModel>('jobs').where('title', 'job1').first();
        expect(result!.uuid).toEqual(uuidGenerator());
    });
});
