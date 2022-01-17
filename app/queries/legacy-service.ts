import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyServices($fromId: String, $pageLength: Int, $query: String) {
    getLegacyServices(fromId: $fromId, pageLength: $pageLength, query: $query) {
      id

      fullName
      name
      region
      shortName
      url

      legacyEntity {
        id

        fullName
        name
      }
    }
  }
`

export const GET_ONE = gql`
  query GetLegacyService($id: String!) {
    getLegacyService(id: $id) {
      id

      fullName
      name
      region
      shortName
      url

      legacyEntity {
        id

        fullName
        name
      }
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateLegacyService($input: LegacyServiceInput!) {
    createLegacyService(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteLegacyService($id: String!) {
    deleteLegacyService(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateLegacyService($id: String!, $input: LegacyServiceInput!) {
    updateLegacyService(id: $id, input: $input) {
      id
    }
  }
`
