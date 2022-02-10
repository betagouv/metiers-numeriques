import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetJobs($pageIndex: Int!, $perPage: Int!, $query: String, $state: String) {
    getJobs(pageIndex: $pageIndex, perPage: $perPage, query: $query, state: $state) {
      count
      data {
        id

        expiredAt
        slug
        state
        title
        updatedAt
      }
      index
      length
    }
  }
`

export const GET_ALL_PUBLIC = gql`
  query GetPublicJobs($pageIndex: Int!, $perPage: Int!, $query: String, $region: String) {
    getPublicJobs(pageIndex: $pageIndex, perPage: $perPage, query: $query, region: $region) {
      count
      data {
        id

        contractTypes
        expiredAt
        missionDescription
        slug
        state
        title
        updatedAt

        address {
          id

          region
        }
        profession {
          id

          name
        }
        recruiter {
          id

          fullName
          name
          websiteUrl
        }

        ########################################
        # Legacy fields

        experiences
        mission
        openedToContractTypes
        reference
        # slug
        source
        # state
        tasks
        team
        # title
        # updatedAt

        legacyService {
          id

          name
          region

          legacyEntity {
            id

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

      applicationDescription
      contractTypes
      createdAt
      expiredAt
      missionDescription
      missionVideoUrl
      particularitiesDescription
      pepUrl
      perksDescription
      processDescription
      profileDescription
      remoteStatus
      salaryMax
      salaryMin
      seniorityInMonths
      slug
      state
      tasksDescription
      teamDescription
      title
      updatedAt

      address {
        id
        sourceId

        city
        postalCode
        region
        street
      }
      applicationContacts {
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
