import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyServices($pageIndex: Int!, $perPage: Int!, $query: String) {
    getLegacyServices(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
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
      index
      length
    }
  }
`

export const GET_LIST = gql`
  query GetLegacyServicesList {
    getLegacyServicesList {
      id

      fullName
      name
      shortName

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
