import { database } from '../../database';
import { PgJobsServiceFactory } from '../repository/PgJobsService';
import { fakeJobs } from './stubs/fakeJobs';

describe('Listing job', () => {
    let jobsService = PgJobsServiceFactory(database);

    // beforeEach(() => {
    //     jobsService.state = [];
    // });


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

// describe('Jobs database', () => {
//     let jobsService = PgJobsService;
//
//     // beforeEach(() => {
//     //     jobsService.state = [];
//     // });
//
//     it('should save a job', async () => {
//         const job = fakeJobs[0];
//         await jobsService.add(job)
//         const result = await database<JobModel>('jobs').where('title', 'job1').first();
//         expect(result)
//     });
// });
