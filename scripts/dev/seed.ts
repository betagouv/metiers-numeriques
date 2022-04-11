import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { UserRole } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import ß from 'bhala'
import fetch from 'cross-fetch'
import cuid from 'cuid'
import * as R from 'ramda'

import getPrisma from '../../api/helpers/getPrisma'

const { NODE_ENV, PROD_API_SECRET, WITH_DATA_SEED } = process.env

if (NODE_ENV !== 'development' && WITH_DATA_SEED !== 'true') {
  process.exit(1)
}

const BCRYPT_SALT_ROUNDS = 10
const PRODUCTION_GRAPGQL_URL = 'https://metiers.numerique.gouv.fr/api/graphql'

async function encrypt(value: string): Promise<string> {
  const salt = await bcryptjs.genSalt(BCRYPT_SALT_ROUNDS)

  const encryptedValue = await bcryptjs.hash(value, salt)

  return encryptedValue
}

const omitTypenameProp: (record: any) => any = R.omit(['__typename'])
const deduplicateById: (records: any[]) => any[] = R.uniqBy(R.prop('id'))

async function seed() {
  if (PROD_API_SECRET === undefined) {
    throw new Error('`PROD_API_SECRET` is undefined.')
  }

  const apollo = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      fetch,
      headers: {
        'x-api-secret': PROD_API_SECRET,
      },
      uri: PRODUCTION_GRAPGQL_URL,
    }),
  })
  const prisma = getPrisma()

  ß.info('[scripts/dev/seed.js] Deleting all refresh tokens…')
  await prisma.refreshToken.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all users…')
  await prisma.user.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all jobs…')
  await prisma.job.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all addresses…')
  await prisma.address.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all contacts…')
  await prisma.contact.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all professions…')
  await prisma.profession.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all recruiters…')
  await prisma.recruiter.deleteMany()

  ß.info('[scripts/dev/seed.js] Deleting all institutions…')
  await prisma.institution.deleteMany()

  ß.info('[scripts/dev/seed.js] Fetching jobs…')
  const getJobs = async (pageIndex = 0, previousJobs: any[] = []): Promise<any[]> => {
    const {
      data: {
        getPublicJobs: { data: jobs },
      },
    } = await apollo.query({
      query: gql`
        query {
          getPublicJobs(pageIndex: ${pageIndex}, perPage: 10) {
            data {
              id

              applicationWebsiteUrl
              contextDescription
              contractTypes
              expiredAt
              missionDescription
              missionVideoUrl
              particularitiesDescription
              perksDescription
              processDescription
              profileDescription
              remoteStatus
              salaryMax
              salaryMin
              seniorityInMonths
              slug
              state
              tasksDescription
              teamDescription
              title
              updatedAt

              address {
                id

                city
                country
                createdAt
                postalCode
                region
                street
                updatedAt
              }
              applicationContacts {
                id

                createdAt
                email
                name
                note
                phone
                position
                updatedAt
              }
              infoContact {
                id

                createdAt
                email
                name
                note
                phone
                position
                updatedAt
              }
              profession {
                id

                createdAt
                name
                updatedAt
              }
              recruiter {
                id

                createdAt
                name
                fullName
                name
                updatedAt
                websiteUrl
              }
            }
          }
        }
      `,
    })

    const allJobs = [...previousJobs, ...jobs]
    if (jobs.length < 10) {
      return allJobs
    }

    return getJobs(pageIndex + 1, allJobs)
  }

  const rawJobs = await getJobs()

  const addresses = R.pipe(R.map(R.prop('address')), deduplicateById, R.map(omitTypenameProp))(rawJobs)
  const professions = R.pipe(R.map(R.prop('profession')), deduplicateById, R.map(omitTypenameProp))(rawJobs)
  const recruiters = R.pipe(R.map(R.prop('recruiter')), deduplicateById, R.map(omitTypenameProp))(rawJobs)

  const applicationContacts = R.pipe(R.map(R.prop('applicationContacts')), R.unnest)(rawJobs)
  const infoContacts = R.map(R.prop('infoContact'))(rawJobs)
  const contacts = R.pipe(deduplicateById, R.map(omitTypenameProp))([...applicationContacts, ...infoContacts])

  const jobs: any[] = R.pipe(
    R.map((rawJob: any) => ({
      ...rawJob,
      addressId: rawJob.address.id,
      // applicationContactIds: rawJob.applicationContacts.map(R.prop('id')),
      infoContactId: rawJob.infoContact.id,
      professionId: rawJob.profession.id,
      recruiterId: rawJob.recruiter.id,
    })),
    R.map(omitTypenameProp),
    R.map(R.omit(['address', 'applicationContacts', 'infoContact', 'profession', 'recruiter'])),
  )(rawJobs)

  ß.info('[scripts/dev/seed.js] Creating test account (admin@beta.gouv.fr / test)…')
  const password = await encrypt('test')
  await prisma.user.create({
    data: {
      email: 'admin@beta.gouv.fr',
      firstName: 'Admin',
      isActive: true,
      lastName: 'Test',
      password,
      role: UserRole.ADMINISTRATOR,
    },
  })

  ß.info('[scripts/dev/seed.js] Creating test account (recruiter@beta.gouv.fr / test)…')
  const institutionId = cuid()
  await prisma.institution.create({
    data: {
      id: institutionId,
      name: 'Test Institution',
      slug: `test-institution-${institutionId}`,
    },
  })
  const recruiter = await prisma.recruiter.create({
    data: {
      institutionId,
      name: 'Test Service',
    },
  })
  await prisma.user.create({
    data: {
      email: 'recruiter@beta.gouv.fr',
      firstName: 'Recruiter',
      isActive: true,
      lastName: 'Test',
      password,
      recruiterId: recruiter.id,
      role: UserRole.RECRUITER,
    },
  })

  ß.info('[scripts/dev/seed.js] Seeding local database with production addresses…')
  await prisma.address.createMany({
    data: addresses,
  })

  ß.info('[scripts/dev/seed.js] Seeding local database with production contacts…')
  await prisma.contact.createMany({
    data: contacts,
  })

  ß.info('[scripts/dev/seed.js] Seeding local database with production professions…')
  await prisma.profession.createMany({
    data: professions,
  })

  ß.info('[scripts/dev/seed.js] Seeding local database with production recruiters…')
  await prisma.recruiter.createMany({
    data: recruiters,
  })

  ß.info('[scripts/dev/seed.js] Seeding local database with production jobs…')
  await prisma.job.createMany({
    data: jobs,
  })
}

seed()
