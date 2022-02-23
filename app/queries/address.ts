import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetAddresses($pageIndex: Int!, $perPage: Int!, $query: String) {
    getAddresses(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        city
        country
        postalCode
        region
        street
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetAddress($id: String!) {
    getAddress(id: $id) {
      id

      city
      country
      postalCode
      region
      street
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateAddress($input: AddressInput!) {
    createAddress(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteAddress($id: String!) {
    deleteAddress(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateAddress($id: String!, $input: AddressInput!) {
    updateAddress(id: $id, input: $input) {
      id
    }
  }
`
