import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLeads($pageIndex: Int!, $perPage: Int!, $query: String) {
    getLeads(pageIndex: $pageIndex, perPage: $perPage, query: $query) {
      count
      data {
        id

        createdAt
        email
        updatedAt
        withAlert
        withNewsletter

        fromJob {
          id

          title
        }
      }
      index
      length
    }
  }
`

export const GET_ONE = gql`
  query GetLead($id: String!) {
    getLead(id: $id) {
      id

      createdAt
      email
      updatedAt
      withAlert
      withNewsletter

      fromJob {
        id

        title
      }
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteLead($id: String!) {
    deleteLead(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateLead($id: String!, $input: LeadInput!) {
    updateLead(id: $id, input: $input) {
      id
    }
  }
`
