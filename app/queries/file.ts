import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetFiles($fromId: String, $pageLength: Int, $query: String) {
    getFiles(fromId: $fromId, pageLength: $pageLength, query: $query) {
      id

      createdAt
      title
      type
      updatedAt
      url
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
