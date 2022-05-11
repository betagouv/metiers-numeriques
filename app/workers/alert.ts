import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import * as R from 'ramda'

import type { Recruiter } from '@prisma/client'

const GET_RECRUITERS = gql`
  query GetRecruiters {
    getRecruiters {
      data {
        id

        displayName

        institutionId
      }
    }
  }
`

const isRecruiterInstitutionless: (recruiter: Recruiter) => boolean = recruiter => R.isNil(recruiter.institutionId)
const filterInstitutionlessRecruiters: (recruiter: Recruiter[]) => Recruiter[] = R.filter(isRecruiterInstitutionless)

export async function getInstitutionlessRecruiters(accessToken?: string): Promise<Recruiter[]> {
  if (accessToken === undefined) {
    return []
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
      getRecruiters: { data: recruiters },
    },
  } = await client.query({
    query: GET_RECRUITERS,
  })
  const institutionlessRecruiters = filterInstitutionlessRecruiters(recruiters)

  return institutionlessRecruiters
}
