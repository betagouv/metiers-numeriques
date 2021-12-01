import usecases from '../usecases'
import { fakeJob, fakeJobs } from './stubs/fakeJobs'

describe('Jobs managmenent', () => {
  it('should get the job list', async () => {
    const jobsRepository = {
      all: () => fakeJobs,
    }

    const result = await usecases.listJobs({ jobsRepository })

    expect(result).toMatchObject([
      {
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
      },
      {
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
      },
    ])
  })

  it('should get one job detail', async () => {
    const jobsRepository = {
      get: () => fakeJob,
    }

    const result = await usecases.getJob(fakeJob.title, { jobsRepository })

    expect(result).toMatchObject({
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
    })
  })
})
