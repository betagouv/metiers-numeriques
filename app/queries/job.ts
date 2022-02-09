import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetJobs($pageIndex: Int!, $perPage: Int!, $query: String, $state: String) {
    getJobs(pageIndex: $pageIndex, perPage: $perPage, query: $query, state: $state) {
      count
      data {
        id

        expiredAt
        state
        title
        updatedAt
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
