import { createJob, Job } from '../../entities';


const fakeJobs: Job[] = [
    createJob(
        {
            uuid: '1',
            title: 'job1',
            experiences: ['Junior'],
            institutionId: 'institution1',
            availableContracts: ['CDD', 'CDI'],
            team: 'MTES',
            publicationDate: new Date().toISOString(),
            limitDate: null,
            details: {
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
            },
            updatedAt: undefined
        }) as Job,
    createJob(
        {
            uuid: '2',
            title: 'job2',
            experiences: ['Senior'],
            institutionId: 'institution2',
            availableContracts: ['Freelance'],
            team: 'MCIS',
            publicationDate: new Date().toISOString(),
            limitDate: null,
            details: {
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
            },
            updatedAt: Date.now()
        }) as Job,
];

const fakeJob = fakeJobs[0];

export {
    fakeJobs,
    fakeJob,
};
