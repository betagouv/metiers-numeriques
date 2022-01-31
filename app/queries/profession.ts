import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetProfessions($pageIndex: Int!, $perPage: Int!, $query: String) {
    getProfessions(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        name

        _count {
          jobs
        }
      }
      index
      length
    }
  }
`

export const GET_LIST = gql`
  query GetProfessionsList {
    getProfessionsList {
      id

      name
    }
  }
`

export const GET_ONE = gql`
  query GetProfession($id: String!) {
    getProfession(id: $id) {
      id

      name
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateProfession($input: ProfessionInput!) {
    createProfession(input: $input) {
      id
    }
  }
`
export const DELETE_ONE = gql`
  mutation DeleteProfession($id: String!) {
    deleteProfession(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateProfession($id: String!, $input: ProfessionInput!) {
    updateProfession(id: $id, input: $input) {
      id
    }
  }
`
