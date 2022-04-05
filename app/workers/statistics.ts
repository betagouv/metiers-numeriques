import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { JobState } from '@prisma/client'
import dayjs from 'dayjs'
import * as R from 'ramda'

import { matomo } from '../libs/matomo'

import type { Job } from '@prisma/client'

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

export type Statistics = {
  activeJobsCount: number | undefined
  newApplicationsCount: number | undefined
  newVisitsCount: number | undefined
}

export async function get(accessToken?: string): Promise<Statistics> {
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
