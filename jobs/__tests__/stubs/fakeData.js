'use strict';

const Job = require('../../entities');

const fakeJobs = [
    new Job(
        {
            id: 'id2',
            title: 'job2',
            mission: 'mon job 2',
            experiences: ['5 ans'],
            location: 'Paris',
            department: ['Ministère des armées'],
            openedToContractTypes: ['CDD', 'CDI'],
            salary: '50k',
            team: 'MTES',
            profile: '',
            objectives: [],
        }),
    new Job(
        {
            id: 'id2',
            title: 'job2',
            mission: 'mon job 2',
            experiences: ['5 ans'],
            location: 'Paris',
            department: ['Ministère des armées'],
            openedToContractTypes: ['CDD', 'CDI'],
            salary: '50k',
            team: 'MTES',
            profile: '',
            objectives: [],
        })
];

const fakeJob = fakeJobs[0];

module.exports = {
    fakeJobs,
    fakeJob
};
