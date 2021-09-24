const usecases = require('../usecases');
const Job = require('../entities');
const {fakeJob, fakeJobs} = require('./stubs/fakeData');

describe('Jobs managmenent', () => {
    it('should get the job list', async () => {
        const jobsRepository = {
            all: () => fakeJobs
        };

        const result = await usecases.ListJobs({jobsRepository});

        expect(result).toEqual([
            new Job(
                {
                    id: 'id2',
                    title: 'job2',
                    mission: 'mon job 2',
                    experiences: ['5 ans'],
                    location: 'Paris',
                    department: ['Ministère des armées'],
                    openedToContractTypes: ['CDD', 'CDI'],
                    salary: '50k',
                    team: 'MTES',
                    profile: '',
                    objectives: [],
                }),
            new Job(
                {
                    id: 'id2',
                    title: 'job2',
                    mission: 'mon job 2',
                    experiences: ['5 ans'],
                    location: 'Paris',
                    department: ['Ministère des armées'],
                    openedToContractTypes: ['CDD', 'CDI'],
                    salary: '50k',
                    team: 'MTES',
                    profile: '',
                    objectives: []
                })
        ]);
    });

    it('should get one job detail', async () => {
        const jobsRepository = {
            get: () => fakeJob
        };

        const result = await usecases.GetJob(fakeJob.name, {jobsRepository});

        expect(result).toEqual(new Job(
            {
                id: 'id2',
                title: 'job2',
                mission: 'mon job 2',
                experiences: ['5 ans'],
                location: 'Paris',
                department: ['Ministère des armées'],
                openedToContractTypes: ['CDD', 'CDI'],
                salary: '50k',
                team: 'MTES',
                profile: '',
                objectives: []
            }));
    });
});
