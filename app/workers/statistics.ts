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

      isMigrated
      limitDate
    }
  }
`

const isJobExpired = (job: Job) => dayjs(job.expiredAt).isBefore(dayjs(), 'day')
const isLegacyJobExpired = (job: LegacyJob) => !job.isMigrated && dayjs(job.limitDate).isBefore(dayjs(), 'day')
const isLegacyJobMigrated = (job: LegacyJob) => job.isMigrated

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
  const migratedLegacyJobs = legacyJobs.filter(isLegacyJobMigrated)

  return {
    expired: {
      count: expiredJobs.length + expiredLegacyJobs.length,
      length: jobs.length + legacyJobs.length - migratedLegacyJobs.length,
    },
    migrated: {
      count: migratedLegacyJobs.length,
      length: legacyJobs.length,
    },
  }
}
