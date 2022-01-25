import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetFiles($pageIndex: Int!, $perPage: Int!, $query: String) {
    getFiles(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        createdAt
        title
        type
        updatedAt
        url
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetFile($id: String!) {
    getFile(id: $id) {
      id

      createdAt
      title
      type
      updatedAt
      url
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateFile($input: FileInput!) {
    createFile(input: $input) {
      id
    }
  }
`
export const DELETE_ONE = gql`
  mutation DeleteFile($id: ID!) {
    deleteFile(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateFile($id: String!, $input: FileInput!) {
    updateFile(id: $id, input: $input) {
      id
    }
  }
`
