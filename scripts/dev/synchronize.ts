import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import ß from 'bhala'
import fetch from 'cross-fetch'
import * as R from 'ramda'

import getPrisma from '../../api/helpers/getPrisma'

const PRODUCTION_GRAPGQL_URL = 'https://metiers.numerique.gouv.fr/api/graphql'

const omitTypenameProp: (list: any[]) => any[] = R.map(R.omit(['__typename']))

async function synchronize() {
  const apollo = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      fetch,
      uri: PRODUCTION_GRAPGQL_URL,
    }),
  })
  const prisma = getPrisma()

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy jobs…')
  await prisma.legacyJob.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy institutions…')
  await prisma.legacyInstitution.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Deleting old files…')
  await prisma.file.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy services…')
  await prisma.legacyService.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy entities…')
  await prisma.legacyEntity.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Fetching legacy entities…')
  const {
    data: {
      getLegacyEntities: { data: legacyEntities },
    },
  } = await apollo.query({
    query: gql`
      query {
        getLegacyEntities(pageIndex: 0, perPage: 1000) {
          data {
            id

            fullName
            logoUrl
            name
          }
        }
      }
    `,
  })

  ß.info('[scripts/dev/synchronize.js] Saving new legacy entities…')
  await prisma.legacyEntity.createMany({
    data: omitTypenameProp(legacyEntities),
  })

  ß.info('[scripts/dev/synchronize.js] Fetching legacy services…')
  const {
    data: {
      getLegacyServices: { data: legacyServices },
    },
  } = await apollo.query({
    query: gql`
      query {
        getLegacyServices(pageIndex: 0, perPage: 1000) {
          data {
            id

            fullName
            name
            region
            shortName
            url

            legacyEntity {
              id
            }
          }
        }
      }
    `,
  })

  ß.info('[scripts/dev/synchronize.js] Saving new legacy services…')
  await prisma.legacyService.createMany({
    data: omitTypenameProp(
      legacyServices.map(({ legacyEntity, ...rest }) => ({
        ...rest,
        legacyEntityId: legacyEntity?.id,
      })),
    ),
  })

  ß.info('[scripts/dev/synchronize.js] Fetching legacy files…')
  const {
    data: {
      getFiles: { data: files },
    },
  } = await apollo.query({
    query: gql`
      query {
        getFiles(pageIndex: 0, perPage: 1000) {
          data {
            id

            createdAt
            title
            type
            updatedAt
            url
          }
        }
      }
    `,
  })

  ß.info('[scripts/dev/synchronize.js] Saving new legacy files…')
  await prisma.file.createMany({
    data: omitTypenameProp(files),
  })

  ß.info('[scripts/dev/synchronize.js] Fetching legacy institutions…')
  const {
    data: {
      getLegacyInstitutions: { data: legacyInstitutions },
    },
  } = await apollo.query({
    query: gql`
      query {
        getLegacyInstitutions(pageIndex: 0, perPage: 1000) {
          data {
            id

            address
            challenges
            fullName
            hiringProcess
            isPublished
            joinTeam
            keyNumbers
            logoFile {
              id
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
            }
            title
            value
            websiteUrls

            files {
              legacyInstitutionId
              file {
                id
              }
              section
              assignedAt
            }
          }
        }
      }
    `,
  })

  ß.info('[scripts/dev/synchronize.js] Saving new legacy institutions…')
  const filesOnLegacyInstitutions: any[] = []
  await prisma.legacyInstitution.createMany({
    data: omitTypenameProp(
      legacyInstitutions.map(({ files, logoFile, thumbnailFile, ...rest }) => {
        if (files !== null) {
          filesOnLegacyInstitutions.push(...files)
        }

        return {
          ...rest,
          logoFileId: logoFile?.id,
          thumbnailFileId: thumbnailFile?.id,
        }
      }),
    ),
  })
  await prisma.filesOnLegacyInstitutions.createMany({
    data: filesOnLegacyInstitutions.map(({ file, ...rest }) => ({
      ...rest,
      fileId: file.id,
    })),
  })

  ß.info('[scripts/dev/synchronize.js] Fetching legacy jobs…')
  const {
    data: {
      getLegacyJobs: { data: legacyJobs },
    },
  } = await apollo.query({
    query: gql`
      query {
        getLegacyJobs(pageIndex: 0, perPage: 1000) {
          data {
            id

            advantages
            conditions
            createdAt
            department
            entity
            experiences
            hiringProcess
            limitDate
            locations
            mission
            more
            openedToContractTypes
            profile
            publicationDate
            reference
            salary
            slug
            source
            state
            tasks
            team
            teamInfo
            title
            toApply
            updatedAt

            legacyService {
              id
            }
          }
        }
      }
    `,
  })

  ß.info('[scripts/dev/synchronize.js] Saving new legacy jobs…')
  await prisma.legacyJob.createMany({
    data: omitTypenameProp(
      legacyJobs.map(({ legacyService, ...rest }) => ({
        ...rest,
        legacyServiceId: legacyService?.id,
      })),
    ),
  })
}

synchronize()
