import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyEntities($pageIndex: Int!, $perPage: Int!, $query: String) {
    getLegacyEntities(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        fullName
        logoUrl
        name
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetLegacyEntity($id: String!) {
    getLegacyEntity(id: $id) {
      id

      fullName
      logoUrl
      name
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateLegacyEntity($input: LegacyEntityInput!) {
    createLegacyEntity(input: $input) {
      id
    }
  }
`
export const DELETE_ONE = gql`
  mutation DeleteLegacyEntity($id: String!) {
    deleteLegacyEntity(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateLegacyEntity($id: String!, $input: LegacyEntityInput!) {
    updateLegacyEntity(id: $id, input: $input) {
      id
    }
  }
`
