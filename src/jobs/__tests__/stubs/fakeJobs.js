const Job = require('../../../models/Job')

const fakeJobs = [
  new Job({
    department: ['Ministère des armées'],
    experiences: ['5 ans'],
    id: 'id2',
    locations: ['Paris'],
    mission: 'mon job 2',
    openedToContractTypes: ['CDD', 'CDI'],
    profile: '',
    salary: '50k',
    tasks: [],
    team: 'MTES',
    title: 'job2',
  }),
  new Job({
    department: ['Ministère des armées'],
    experiences: ['5 ans'],
    id: 'id2',
    locations: ['Paris'],
    mission: 'mon job 2',
    openedToContractTypes: ['CDD', 'CDI'],
    profile: '',
    salary: '50k',
    tasks: [],
    team: 'MTES',
    title: 'job2',
  }),
]

const fakeJob = fakeJobs[0]

module.exports = {
  fakeJob,
  fakeJobs,
}
