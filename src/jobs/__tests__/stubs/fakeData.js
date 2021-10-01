'use strict';

const Job = require('../../entities');

const fakeJobs = [
    new Job(
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
        }),
    new Job(
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
        })
];

const fakeJob = fakeJobs[0];

module.exports = {
    fakeJobs,
    fakeJob
};
