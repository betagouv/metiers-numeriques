import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetJobs($pageIndex: Int!, $perPage: Int!, $query: String, $source: String, $state: String) {
    getJobs(pageIndex: $pageIndex, perPage: $perPage, query: $query, source: $source, state: $state) {
      count
      data {
        id

        expiredAt
        slug
        state
        title
        updatedAt

        recruiter {
          id

          displayName
        }
      }
      index
      length
    }
  }
`

export const GET_ALL_PUBLIC = gql`
  query GetPublicJobs(
    $contractTypes: [String]
    $institutionIds: [String]
    $pageIndex: Int!
    $perPage: Int!
    $professionId: String
    $domainId: String
    $query: String
    $region: String
    $remoteStatuses: [String]
    $seniorityInMonths: Int
  ) {
    getPublicJobs(
      contractTypes: $contractTypes
      institutionIds: $institutionIds
      pageIndex: $pageIndex
      perPage: $perPage
      professionId: $professionId
      domainId: $domainId
      query: $query
      region: $region
      remoteStatuses: $remoteStatuses
      seniorityInMonths: $seniorityInMonths
    ) {
      count
      data {
        id

        contractTypes
        missionDescription
        seniorityInMonths
        slug
        title
        updatedAt

        domains {
          id
          name
        }
        address {
          id

          country
          region
        }
        profession {
          id

          name
        }
        recruiter {
          id

          displayName
          websiteUrl
          institution {
            name
          }
        }
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetJob($id: String!) {
    getJob(id: $id) {
      id

      applicationWebsiteUrl
      contextDescription
      contractTypes
      createdAt
      expiredAt
      missionDescription
      missionVideoUrl
      particularitiesDescription
      perksDescription
      processDescription
      profileDescription
      remoteStatus
      salaryMax
      salaryMin
      seniorityInMonths
      slug
      source
      sourceUrl
      state
      tasksDescription
      teamDescription
      title
      updatedAt

      address {
        id
        sourceId

        city
        country
        postalCode
        region
        street
      }
      applicationContacts {
        id
      }
      domains {
        id
      }
      infoContact {
        id
      }
      profession {
        id
      }
      recruiter {
        id
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateJob($input: JobInput!) {
    createJob(input: $input) {
      id
    }
  }
`
export const DELETE_ONE = gql`
  mutation DeleteJob($id: String!) {
    deleteJob(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateJob($id: String!, $input: JobInput!) {
    updateJob(id: $id, input: $input) {
      id
    }
  }
`
