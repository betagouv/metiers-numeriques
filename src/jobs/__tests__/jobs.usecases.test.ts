import { JobDetailDTO } from '../types';
import { InMemoryJobsService } from '../repository/inMemoryJobsService';
import * as usecases from '../usecases';
import { fakeJob } from './stubs/fakeJobs';

describe('Jobs managmenent', () => {
    let jobsService: InMemoryJobsService;

    beforeEach(() => {
        jobsService = new InMemoryJobsService();
    });


    it('should get the job list', async () => {
        const result = await usecases.listJobs({ jobsService }, null);

        expect(result.jobs).toEqual([
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
                tasks: [],
                profile: undefined
            },
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
                tasks: [],
                profile: undefined
            },
        ]);
    });

    it('should get one job detail', async () => {
        const result: JobDetailDTO = await usecases.getJob(fakeJob.title, { jobsService }, '') as JobDetailDTO;

        expect(result).toEqual(
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
                tasks: [],
                profile: undefined
            });
    });

    it('should create a job with minimal data', async () => {
        const job = new Job({
            availableContracts: ['CDD', 'CDI'],
            details: '',
            experiences: ['Junior'],
            institution: 'uuid1',
            limitDate: null,
            publicationDate: Date.now(),
            title: 'job 1',
            team: 'MTES'
        });

        await usecases.addJob(job, {jobsService});

        expect(jobsService.jobs).toContain(job);
    })
});
