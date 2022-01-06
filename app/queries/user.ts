import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetUsers($fromId: String, $pageLength: Int, $query: String) {
    getUsers(fromId: $fromId, pageLength: $pageLength, query: $query) {
      id

      email
      firstName
      isActive
      lastName
      role
    }
  }
`

export const GET_ONE = gql`
  query GetUser($id: String!) {
    getUser(id: $id) {
      id

      email
      firstName
      isActive
      lastName
      role
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateUser($id: String!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
    }
  }
`
