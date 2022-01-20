import { gql } from '@apollo/client'

export const GET_ALL = gql`
  query GetLegacyInstitutions($fromId: String, $pageLength: Int, $query: String) {
    getLegacyInstitutions(fromId: $fromId, pageLength: $pageLength, query: $query) {
      id

      fullName
      logoFile {
        id

        title
        url
      }
      slug
      thumbnailFile {
        id

        title
        url
      }
      title
    }
  }
`

export const GET_ONE = gql`
  query GetLegacyInstitution($id: String, $slug: String) {
    getLegacyInstitution(id: $id, slug: $slug) {
      id

      address
      challenges
      files {
        id

        file {
          id

          title
          url
        }
        section
      }
      fullName
      hiringProcess
      isPublished
      joinTeam
      keyNumbers
      logoFile {
        id

        title
        url
      }
      missions
      motivation
      organization
      profile
      project
      schedule
      slug
      socialNetworkUrls
      testimonial
      thumbnailFile {
        id

        title
        url
      }
      title
      value
      websiteUrls
    }
  }
`

export const CREATE_ONE = gql`
  mutation CreateLegacyInstitution($input: LegacyInstitutionInput!) {
    createLegacyInstitution(input: $input) {
      id
    }
  }
`

export const DELETE_ONE = gql`
  mutation DeleteLegacyInstitution($id: String!) {
    deleteLegacyInstitution(id: $id) {
      id
    }
  }
`

export const UPDATE_ONE = gql`
  mutation UpdateLegacyInstitution($id: String!, $input: LegacyInstitutionInput!) {
    updateLegacyInstitution(id: $id, input: $input) {
      id
    }
  }
`
