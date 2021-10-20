const usecases = require('../usecases');
const { Job } = require('../entities');
const {fakeJob, fakeJobs} = require('./stubs/fakeJobs');

describe('Jobs managmenent', () => {
    it('should get the job list', async () => {
        const jobsRepository = {
            all: () => fakeJobs
        };

        const result = await usecases.listJobs({jobsRepository});

        expect(result).toEqual([
            new Job(
                {
                    id: 'id2',
                    title: 'job2',
                    mission: 'mon job 2',
                    experiences: ['5 ans'],
                    locations: ['Paris'],
                    department: ['Ministère des armées'],
                    openedToContractTypes: ['CDD', 'CDI'],
                    salary: '50k',
                    team: 'MTES',
                    profile: '',
                    tasks: [],
                }),
            new Job(
                {
                    id: 'id2',
                    title: 'job2',
                    mission: 'mon job 2',
                    experiences: ['5 ans'],
                    locations: ['Paris'],
                    department: ['Ministère des armées'],
                    openedToContractTypes: ['CDD', 'CDI'],
                    salary: '50k',
                    team: 'MTES',
                    profile: '',
                    tasks: []
                })
        ]);
    });

    it('should get one job detail', async () => {
        const jobsRepository = {
            get: () => fakeJob
        };

        const result = await usecases.getJob(fakeJob.title, {jobsRepository});

        expect(result).toEqual(new Job(
            {
                id: 'id2',
                title: 'job2',
                mission: 'mon job 2',
                experiences: ['5 ans'],
                locations: ['Paris'],
                department: ['Ministère des armées'],
                openedToContractTypes: ['CDD', 'CDI'],
                salary: '50k',
                team: 'MTES',
                profile: '',
                tasks: []
            }));
    });
});
