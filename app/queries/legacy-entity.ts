import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyEntities($fromId: String, $pageLength: Int, $query: String) {
    getLegacyEntities(fromId: $fromId, pageLength: $pageLength, query: $query) {
      id

      fullName
      logoUrl
      name
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
