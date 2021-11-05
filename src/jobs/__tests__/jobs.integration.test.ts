import { database } from '../../database';
import { JobModel } from '../../knex/models';
import { UuidGenerator, uuidGeneratorFactory } from '../../shared/uuidGenerator';
import { JobsService } from '../interfaces';
import { PgJobsServiceFactory } from '../repository/PgJobsService';
import { fakeJobs } from './stubs/fakeJobs';

describe('Listing job', () => {
    let jobsService: JobsService;
    let uuidGenerator: UuidGenerator;

    beforeEach(async () => {
        // reset and seed db
        // await database.raw('create database metiernumtest');
        // await database.schema = 'metiernumtest'
        await database.migrate.rollback();
        await database.migrate.latest();
        await database.seed.run();
        jobsService = PgJobsServiceFactory(database);
        uuidGenerator = uuidGeneratorFactory('407ccaa8-9812-4abe-a8b3-fc88e5b1b993');
    });

    afterEach(async () => {
        await database.migrate.rollback();
    });

    afterAll(() => {
        database.destroy();
    });


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
