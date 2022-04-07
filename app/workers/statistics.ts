import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import queries from '@app/queries'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import * as R from 'ramda'

import { matomo } from '../libs/matomo'

import type { Institution, Job } from '@prisma/client'

const GET_ALL_JOBS = gql`
  query GetAllJobs {
    getAllJobs {
      id

      expiredAt
      state
    }
  }
`

const isJobActive = (job: Job) => job.state === JobState.PUBLISHED && !dayjs(job.expiredAt).isBefore(dayjs(), 'day')
const filterActiveJobs: (job: Job[]) => Job[] = R.filter(isJobActive)

export type GlobalStatistics = {
  activeJobsCount: number | undefined
  newApplicationsCount: number | undefined
  newVisitsCount: number | undefined
}

export async function getGlobal(accessToken?: string): Promise<GlobalStatistics> {
  if (accessToken === undefined) {
    return {
      activeJobsCount: undefined,
      newApplicationsCount: undefined,
      newVisitsCount: undefined,
    }
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    uri: '/api/graphql',
  })

  const {
    data: { getAllJobs: jobs },
  } = await client.query({
    query: GET_ALL_JOBS,
  })
  const activeJobs = filterActiveJobs(jobs)

  const newApplicationsCount = await matomo.getApplicationsCount()
  const newVisitsCount = await matomo.getVisitsCount()

  return {
    activeJobsCount: activeJobs.length,
    newApplicationsCount,
    newVisitsCount,
  }
}

export type LocalStatistics = {
  activeJobsCount: number | undefined
  institution: Institution | undefined
}

export async function getLocal(accessToken?: string, recruiterId?: string): Promise<LocalStatistics> {
  if (accessToken === undefined || recruiterId === undefined) {
    return {
      activeJobsCount: undefined,
      institution: undefined,
    }
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    uri: '/api/graphql',
  })

  const {
    data: {
      getJobs: { data: jobs },
    },
  } = await client.query({
    query: queries.job.GET_ALL,
    variables: {
      pageIndex: 0,
      perPage: 1000,
    },
  })
  const activeJobs = filterActiveJobs(jobs)

  const {
    data: { getRecruiter: recruiter },
  } = await client.query({
    query: queries.recruiter.GET_ONE,
    variables: {
      id: recruiterId,
    },
  })

  return {
    activeJobsCount: activeJobs.length,
    institution: { ...recruiter.institution },
  }
}
