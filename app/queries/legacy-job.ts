import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyJobs(
    $pageIndex: Int!
    $perPage: Int!
    $query: String
    $region: String
    $source: String
    $state: String
  ) {
    getLegacyJobs(
      pageIndex: $pageIndex
      perPage: $perPage
      query: $query
      region: $region
      source: $source
      state: $state
    ) {
      count
      data {
        id

        experiences
        mission
        openedToContractTypes
        reference
        slug
        source
        state
        tasks
        team
        title
        updatedAt

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
  query GetLegacyJob($id: String, $slug: String) {
    getLegacyJob(id: $id, slug: $slug) {
      id

      advantages
      conditions
      createdAt
      department
      entity
      experiences
      hiringProcess
      limitDate
      locations
      mission
      more
      openedToContractTypes
      profile
      publicationDate
      reference
      salary
      slug
      source
      state
      tasks
      team
      teamInfo
      title
      toApply
      updatedAt

      legacyService {
        id

        fullName
        name
        url

        legacyEntity {
          id

          fullName
          name
        }
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateLegacyJob($input: LegacyJobInput!) {
    createLegacyJob(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteLegacyJob($id: String!) {
    deleteLegacyJob(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateLegacyJob($id: String!, $input: LegacyJobInput!) {
    updateLegacyJob(id: $id, input: $input) {
      id
    }
  }
`
