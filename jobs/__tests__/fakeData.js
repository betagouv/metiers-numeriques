const fakeJobs = [
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
]

const fakeJob = fakeJobs[0];

module.exports = {
    fakeJobs,
    fakeJob
}
