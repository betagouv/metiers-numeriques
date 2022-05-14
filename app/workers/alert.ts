import { ApolloClient, gql, InMemoryCache } from '@apollo/client'

import type { GetAllResponse } from '@api/resolvers/types'
import type { Recruiter, User } from '@prisma/client'

const GET_LAST_INSTITUTIONLESS_RECRUITERS = gql`
  query GetLastIntitutionLessRecruiters {
    getRecruiters(isInstitutionless: true, pageIndex: 0, perPage: 10) {
      data {
        id

        displayName

        institutionId
      }
      length
    }
  }
`

const GET_LAST_INACTIVE_USERS = gql`
  query GetLastInactiveUsers {
    getUsers(isActive: false, orderBy: ["createdAt", "desc"], pageIndex: 0, perPage: 10) {
      data {
        id

        createdAt
        extra {
          requestedInstitution
          requestedService
        }
        firstName
        lastName
      }
      length
    }
  }
`

export async function getInstitutionlessRecruiters(accessToken?: string): Promise<GetAllResponse<Recruiter>> {
  if (accessToken === undefined) {
    return {
      count: 0,
      data: [],
      index: 0,
      length: 0,
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
    data: { getRecruiters: result },
  } = await client.query({
    query: GET_LAST_INSTITUTIONLESS_RECRUITERS,
  })

  return result
}

export async function getLastInactiveUsers(accessToken?: string): Promise<GetAllResponse<User>> {
  if (accessToken === undefined) {
    return {
      count: 0,
      data: [],
      index: 0,
      length: 0,
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
    data: { getUsers: result },
  } = await client.query({
    query: GET_LAST_INACTIVE_USERS,
  })

  return result
}
