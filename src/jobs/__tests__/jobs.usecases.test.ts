import { UuidGenerator, uuidGeneratorFactory } from '../../shared/uuidGenerator';
import { createJob, Job } from '../entities';
import { InMemoryJobsService } from '../repository/inMemoryJobsService';
import { JobDetailDTO } from '../types';
import * as usecases from '../usecases';
import { AddJobDTO } from '../usecases';
import { fakeJobs } from './stubs/fakeJobs';

const emptyDetails = {
    mission: '',
    team: '',
    locations: '',
    teamInfo: '',
    tasks: '',
    profile: '',
    salary: '',
    hiringProcess: '',
    conditions: '',
    advantages: '',
    more: '',
    toApply: '',
}

describe('Listing job', () => {
    let jobsService: typeof InMemoryJobsService = InMemoryJobsService;

    beforeEach(() => {
        jobsService.state = [];
    });


    it('should get the job list', async () => {
        jobsService.feedWith(fakeJobs);
        const result = await usecases.listJobs({}, { jobsService });

        expect(result.jobs.length).toEqual(2);
        expect(result.jobs).toEqual([
            {
                uuid: '1',
                title: 'job1',
                experiences: ['Junior'],
                institution: { uuid: 'institution1', name: 'Institution 1' },
                availableContracts: ['CDD', 'CDI'],
                team: 'MTES',
                publicationDate: fakeJobs[0].publicationDate,
                limitDate: null,
                details: emptyDetails,
                updatedAt: null,
            },
            {
                uuid: '2',
                title: 'job2',
                experiences: ['Senior'],
                institution: { uuid: 'institution2', name: 'Institution 2' },
                availableContracts: ['Freelance'],
                team: 'MCIS',
                publicationDate: fakeJobs[1].publicationDate,
                limitDate: null,
                details: emptyDetails,
                updatedAt: fakeJobs[1].updatedAt,
            },
        ]);
    });

    it('should get one job detail', async () => {
        jobsService.feedWith(fakeJobs);
        const result: JobDetailDTO = await usecases.getJob(fakeJobs[1].uuid, { jobsService }) as JobDetailDTO;

        expect(result).toEqual(
            {
                uuid: '2',
                title: 'job2',
                experiences: ['Senior'],
                institution: { uuid: 'institution2', name: 'Institution 2' },
                availableContracts: ['Freelance'],
                team: 'MCIS',
                publicationDate: fakeJobs[1].publicationDate,
                limitDate: null,
                details: emptyDetails,
                updatedAt: fakeJobs[1].updatedAt,
            });
    });
});

describe('Creating jobs', () => {
    let jobsService: typeof InMemoryJobsService = InMemoryJobsService;
    let uuidGenerator: UuidGenerator;
    let defaultJobDTO: AddJobDTO;
    let now = new Date();

    beforeEach(() => {
        jobsService.state = [];
        uuidGenerator = uuidGeneratorFactory('abc');
        defaultJobDTO = {
            title: 'job1',
            experiences: ['Junior'],
            institutionId: 'institution1',
            availableContracts: ['CDD', 'CDI'],
            team: 'MTES',
            publicationDate: now.toISOString(),
            limitDate: null,
            details: emptyDetails,
        };
    });

    it('should create a job with minimal data', async () => {
        await usecases.addJob(defaultJobDTO, { jobsService, uuidGenerator });

        expect(jobsService.state[0]).toEqual(
            createJob(
                {
                    uuid: uuidGenerator(),
                    title: 'job1',
                    experiences: ['Junior'],
                    institutionId: 'institution1',
                    availableContracts: ['CDD', 'CDI'],
                    team: 'MTES',
                    publicationDate: now.toISOString(),
                    limitDate: null,
                    details: defaultJobDTO.details,
                }) as Job);
    });


    it('should error when creating with missing data', async () => {
        const jobDTO: AddJobDTO = defaultJobDTO;
        // @ts-ignore
        jobDTO.availableContracts = undefined;

        const result = await usecases.addJob(jobDTO, { jobsService, uuidGenerator }) as Error;
        await expect(result).toBeInstanceOf(Error);
        await expect(result.message).toEqual('Missing fields');
    });

    it('should error when the institution is not found', async () => {
        const jobDTO: AddJobDTO = defaultJobDTO;
        jobDTO.institutionId = 'institution3';

        const result = await usecases.addJob(jobDTO, { jobsService, uuidGenerator }) as Error;
        await expect(result).toBeInstanceOf(Error);
        await expect(result.message).toEqual('Institution not found');
    });

    // TODO: more validation on fields
    // check date publication / limite valide (pas dans le passé ie)
});
