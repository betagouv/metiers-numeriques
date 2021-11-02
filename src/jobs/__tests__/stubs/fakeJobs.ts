import { createJob, Job } from '../../entities';


const fakeJobs: Job[] = [
    createJob(
        {
            id: '1',
            title: 'job1',
            experiences: ['Junior'],
            institution: 'institution1',
            availableContracts: ['CDD', 'CDI'],
            team: 'MTES',
            publicationDate: new Date().toISOString(),
            limitDate: null,
            details: ''
        }) as Job,
    createJob(
        {
            id: '2',
            title: 'job2',
            experiences: ['Senior'],
            institution: 'institution2',
            availableContracts: ['Freelance'],
            team: 'MCIS',
            publicationDate: new Date().toISOString(),
            limitDate: null,
            details: ''
        }) as Job,
];

const fakeJob = fakeJobs[0];

export {
    fakeJobs,
    fakeJob,
};
