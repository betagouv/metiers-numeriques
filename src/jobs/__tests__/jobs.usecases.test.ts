import { JobDetailDTO } from '../entities';
import { InMemoryJobsService } from '../infrastructure/inMemoryJobsService';
import * as usecases from '../usecases';
import { fakeJob } from './stubs/fakeJobs';

describe('Jobs managmenent', () => {
    let jobsService: typeof InMemoryJobsService;

    beforeEach(() => {
        jobsService = InMemoryJobsService;
    });


    it('should get the job list', async () => {
        const result: JobDetailDTO[] = await usecases.listJobs({ jobsService }, null);

        expect(result).toEqual([
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
                profile: '',
                tasks: [],
            },
        ]);
    });

    it('should get one job detail', async () => {
        const result: JobDetailDTO = await usecases.getJob(fakeJob.title, { jobsService }, '');

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
                profile: '',
                tasks: [],
            });
    });
});
