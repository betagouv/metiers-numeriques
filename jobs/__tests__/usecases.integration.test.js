const usecases = require('../usecases');
const {NotionJobsService} = require('../infrastructure/NotionJobsRepository');
const jobsStub = require('./jobs.stub.json');
const axios = require('axios');

jest.mock("axios");

describe('Jobs fetch api', () => {
    it('should fetch and return a list of job', async () => {
        axios.post.mockImplementation(() => Promise.resolve({ data: jobsStub }));

        const result = await NotionJobsService.all()

        expect(result).toEqual([
            {
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

    it.skip('should fetch and return one job', async () => {
        const jobsRepository = {
            get: () => fakeJob
        }

        const result = await usecases.GetJob(fakeJob.name, {jobsRepository})

        expect(result).toEqual(fakeJob);
    });
});
