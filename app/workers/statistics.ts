import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import dayjs from 'dayjs'

import type { Job, LegacyJob } from '@prisma/client'

const GET_ALL_JOBS = gql`
  query GetAllJobs {
    getAllJobs {
      id

      expiredAt
    }
  }
`

const GET_ALL_LEGACY_JOBS = gql`
  query GetAllLegacyJobs {
    getAllLegacyJobs {
      id

      limitDate
    }
  }
`

const isJobExpired = (job: Job) => dayjs(job.expiredAt).isBefore(dayjs(), 'day')
const isLegacyJobExpired = (job: LegacyJob) => dayjs(job.limitDate).isBefore(dayjs(), 'day')

export async function jobs(accessToken?: string): Promise<
  | {
      expired: {
        count: number
        length: number
      }
      migrated: {
        count: number
        length: number
      }
    }
  | undefined
> {
  if (accessToken === undefined) {
    return undefined
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
  const {
    data: { getAllLegacyJobs: legacyJobs },
  } = await client.query({
    query: GET_ALL_LEGACY_JOBS,
  })

  const expiredJobs = jobs.filter(isJobExpired)
  const expiredLegacyJobs = legacyJobs.filter(isLegacyJobExpired)

  return {
    expired: {
      count: expiredJobs.length + expiredLegacyJobs.length,
      length: jobs.length + legacyJobs.length,
    },
    migrated: {
      count: jobs.length,
      length: legacyJobs.length,
    },
  }
}
