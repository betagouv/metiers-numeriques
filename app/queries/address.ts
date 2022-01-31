import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetAddresses($pageIndex: Int!, $perPage: Int!, $query: String) {
    getAddresses(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        city
        postalCode
        region
        street
      }
      index
      length
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
