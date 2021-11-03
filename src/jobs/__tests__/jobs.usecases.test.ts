import { createJob, Job } from '../entities';
import { InMemoryJobsService } from '../repository/inMemoryJobsService';
import { JobDetailDTO } from '../types';
import * as usecases from '../usecases';
import { AddJobDTO } from '../usecases';
import { fakeJobs } from './stubs/fakeJobs';

describe('Listing job', () => {
    let jobsService: typeof InMemoryJobsService = InMemoryJobsService;

    beforeEach(() => {
        jobsService.state = [];
    });


    it('should get the job list', async () => {
        await jobsService.feedWith(fakeJobs);
        const result = await usecases.listJobs({}, { jobsService });

        expect(result.jobs.length).toEqual(2);
        expect(result.jobs).toEqual([
            {
                id: '1',
                title: 'job1',
                experiences: ['Junior'],
                institution: { id: 'institution1', name: 'Institution 1' },
                availableContracts: ['CDD', 'CDI'],
                team: 'MTES',
                publicationDate: fakeJobs[0].publicationDate,
                limitDate: null,
                details: '',
                updatedAt: null,
            },
            {
                id: '2',
                title: 'job2',
                experiences: ['Senior'],
                institution: { id: 'institution2', name: 'Institution 2' },
                availableContracts: ['Freelance'],
                team: 'MCIS',
                publicationDate: fakeJobs[1].publicationDate,
                limitDate: null,
                details: '',
                updatedAt: fakeJobs[1].updatedAt,
            },
        ]);
    });

    it('should get one job detail', async () => {
        await jobsService.feedWith(fakeJobs);
        const result: JobDetailDTO = await usecases.getJob(fakeJobs[1].id, { jobsService }) as JobDetailDTO;

        expect(result).toEqual(
            {
                id: '2',
                title: 'job2',
                experiences: ['Senior'],
                institution: { id: 'institution2', name: 'Institution 2' },
                availableContracts: ['Freelance'],
                team: 'MCIS',
                publicationDate: fakeJobs[1].publicationDate,
                limitDate: null,
                details: '',
                updatedAt: fakeJobs[1].updatedAt,
            });
    });
});

describe('Creating jobs', () => {
    let jobsService: typeof InMemoryJobsService = InMemoryJobsService;

    beforeEach(() => {
        jobsService.state = [];
    });

    it('should create a job with minimal data', async () => {
        const now = new Date();
        const jobDTO: AddJobDTO = {
            id: '1',
            title: 'job1',
            experiences: ['Junior'],
            institution: 'institution1',
            availableContracts: ['CDD', 'CDI'],
            team: 'MTES',
            publicationDate: now.toISOString(),
            limitDate: null,
            details: '',
        };

        await usecases.addJob(jobDTO, { jobsService });

        expect(jobsService.state[0]).toEqual(
            createJob(
                {
                    id: '1',
                    title: 'job1',
                    experiences: ['Junior'],
                    institution: 'institution1',
                    availableContracts: ['CDD', 'CDI'],
                    team: 'MTES',
                    publicationDate: now.toISOString(),
                    limitDate: null,
                    details: '',
                }) as Job);
    });


    it('should error when creating with missing data', async () => {
        const jobDTO: AddJobDTO = {
            id: 'def',
            title: 'job1',
            experiences: ['Junior'],
            institution: 'institution1',
            // @ts-ignore
            availableContracts: undefined,
            team: 'MTES',
            publicationDate: new Date().toISOString(),
            limitDate: null,
            details: '',
        };

        await expect(usecases.addJob(jobDTO, { jobsService })).rejects.toThrow();
    });


    // TODO: more validation
});
