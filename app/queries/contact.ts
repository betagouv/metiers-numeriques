import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetContacts($pageIndex: Int!, $perPage: Int!, $query: String) {
    getContacts(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        email
        name
        phone
      }
      index
      length
    }
  }
`

export const GET_LIST = gql`
  query GetContactsList {
    getContactsList {
      id

      name
      email
    }
  }
`

export const GET_ONE = gql`
  query GetContact($id: String!) {
    getContact(id: $id) {
      id

      email
      name
      note
      phone
      position
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateContact($input: ContactInput!) {
    createContact(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteContact($id: String!) {
    deleteContact(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateContact($id: String!, $input: ContactInput!) {
    updateContact(id: $id, input: $input) {
      id
    }
  }
`
