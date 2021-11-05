import { v4 } from 'uuid';
import { database } from '../../database';
import { JobModel } from '../../knex/models';
import { PgJobsServiceFactory } from '../repository/PgJobsService';
import { fakeJobs } from './stubs/fakeJobs';

describe('Listing job', () => {
    let jobsService = PgJobsServiceFactory(database);

    // beforeEach(() => {
    //     jobsService.state = [];
    // });


    it.skip('should get the job list', async () => {
        const result = await jobsService.list({})
        expect(result.jobs.length).toEqual(2);
    });

    it.skip('should get one job detail', async () => {
        const result = await jobsService.get('a')
        expect(result).toBeDefined();
    });

    it('should save a job', async () => {
        const testUUID = v4();
        const job = {
            ...fakeJobs[0],
            uuid: testUUID,
            institutionId: testUUID,
        };
        await jobsService.add(job);
        const result = await database<JobModel>('jobs').where('title', 'job1').first();
        expect(result!.uuid).toEqual(testUUID);
    });
});
