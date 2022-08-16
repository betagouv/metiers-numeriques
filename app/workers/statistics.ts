import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { queries } from '@app/queries'
import * as R from 'ramda'

import { isJobActive } from '../helpers/isJobActive'
import { matomo } from '../libs/matomo'

import type { InstitutionFromGetOne, RecruiterWithJobsAndUsers } from '@api/resolvers/institutions'
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

const aggregateInstitutionJobs = (institution: InstitutionFromGetOne) =>
  R.pipe(
    R.prop('recruiters') as any,
    R.map<RecruiterWithJobsAndUsers, Job[]>(R.prop('jobs')),
    R.flatten,
  )(institution) as Job[]
const filterActiveJobs: (job: Job[]) => Job[] = R.filter(isJobActive)

export type GlobalStatistics = {
  activeJobsCount: number | undefined
  newApplicationsCount: number | undefined
  newVisitsCount: number | undefined
}

export async function getGlobal(): Promise<GlobalStatistics> {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
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

export async function getLocal(institutionId?: string): Promise<LocalStatistics> {
  if (institutionId === undefined) {
    return {
      activeJobsCount: undefined,
      institution: undefined,
    }
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: '/api/graphql',
  })

  const {
    data: { getInstitution: institution },
  } = await client.query({
    query: queries.institution.GET_ONE,
    variables: {
      id: institutionId,
    },
  })
  const jobs = aggregateInstitutionJobs(institution)
  const activeJobs = filterActiveJobs(jobs)

  return {
    activeJobsCount: activeJobs.length,
    institution,
  }
}
