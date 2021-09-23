const usecases = require('../usecases');
const {fakeJob, fakeJobs} = require('./stubs/fakeData');

describe('Jobs managmenent', () => {
    it('should get the job list', async () => {
        const jobsRepository = {
            all: () => fakeJobs
        }

        const result = await usecases.ListJobs({jobsRepository})

        expect(result).toEqual([
            {
                id: 'id1',
                name: 'job1',
                shortDescription: 'mon job 1',
                experience: '2 ans',
                localisation: 'Paris',
                department: 'Ministère des armées',
                contractTypes: ['CDD', 'CDI'],
                salary: '30k',
                team: 'DINUM'
            },
            {
                id: 'id2',
                name: 'job2',
                shortDescription: 'mon job 2',
                experience: '5 ans',
                localisation: 'Paris',
                department: 'Ministère des armées',
                contractTypes: ['CDD', 'CDI'],
                salary: '50k',
                team: 'MTES'
            }
        ]);
    });

    it('should get one job detail', async () => {
        const jobsRepository = {
            get: () => fakeJob
        }

        const result = await usecases.GetJob(fakeJob.name, {jobsRepository})

        expect(result).toEqual(fakeJob);
    });
});
