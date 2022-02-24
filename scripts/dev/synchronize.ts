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

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy services…')
  await prisma.legacyService.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Deleting old legacy entities…')
  await prisma.legacyEntity.deleteMany()

  ß.info('[scripts/dev/synchronize.js] Fetching legacy jobs…')
  const getLegacyJobs = async (pageIndex = 0, previousLegacyJobs: any[] = []): Promise<any[]> => {
    const {
      data: {
        getPublicLegacyJobs: { data: legacyJobs },
      },
    } = await apollo.query({
      query: gql`
        query {
          getPublicLegacyJobs(pageIndex: ${pageIndex}, perPage: 10) {
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

                fullName
                name
                url

                legacyEntity {
                  id

                  fullName
                  name
                }
              }
            }
          }
        }
      `,
    })

    const allLegacyJobs = [...previousLegacyJobs, ...legacyJobs]
    if (legacyJobs.length < 10) {
      return allLegacyJobs
    }

    return getLegacyJobs(pageIndex + 1, allLegacyJobs)
  }

  const legacyJobs = await getLegacyJobs()

  const legacyServices = R.uniqBy(R.prop('id'))(
    legacyJobs.map(legacyJob => legacyJob.legacyService).filter(legacyService => legacyService !== null),
  ) as any[]
  const legacyEntities = R.uniqBy(R.prop('id'))(
    legacyServices.map(legacyService => legacyService.legacyEntity).filter(legacyService => legacyService !== null),
  )

  ß.info('[scripts/dev/synchronize.js] Saving new legacy entities…')
  await prisma.legacyEntity.createMany({
    data: omitTypenameProp(legacyEntities),
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
