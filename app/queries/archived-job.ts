import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetArchivedJobs($pageIndex: Int!, $perPage: Int!, $query: String) {
    getArchivedJobs(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        expiredAt
        slug
        source
        title
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetArchivedJob($id: String!) {
    getArchivedJob(id: $id) {
      id
      sourceId

      createdAt
      expiredAt
      missionDescription
      profileDescription
      recruiterName
      region
      slug
      source
      title
      updatedAt

      profession {
        id

        name
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateArchivedJob($input: ArchivedJobInput!) {
    createArchivedJob(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteArchivedJob($id: String!) {
    deleteArchivedJob(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateArchivedJob($id: String!, $input: ArchivedJobInput!) {
    updateArchivedJob(id: $id, input: $input) {
      id
    }
  }
`
