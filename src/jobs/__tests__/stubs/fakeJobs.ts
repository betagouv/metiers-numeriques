import { JobDetailDTO } from '../../types';


const fakeJobs: JobDetailDTO[] = [
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
        profile: undefined,
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
        profile: undefined,
        tasks: [],
    },
];

const fakeJob = fakeJobs[0];

export {
    fakeJobs,
    fakeJob,
};
