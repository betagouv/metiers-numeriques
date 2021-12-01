import Job from '../../../models/Job'

export const fakeJobs = [
  new Job({
    department: ['Ministère des armées'],
    experiences: ['5 ans'],
    id: 'id2',
    locations: ['Paris'],
    mission: 'mon job 2',
    openedToContractTypes: ['CDD', 'CDI'],
    profile: [''],
    salary: '50k',
    tasks: [],
    team: 'MTES',
    title: 'job2',
  } as any),
  new Job({
    department: ['Ministère des armées'],
    experiences: ['5 ans'],
    id: 'id2',
    locations: ['Paris'],
    mission: 'mon job 2',
    openedToContractTypes: ['CDD', 'CDI'],
    profile: [''],
    salary: '50k',
    tasks: [],
    team: 'MTES',
    title: 'job2',
  } as any),
]

export const fakeJob = fakeJobs[0]
