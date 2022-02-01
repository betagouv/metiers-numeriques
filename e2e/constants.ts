import { JobState } from '@prisma/client'

import { REGION } from '../common/constants'

export const TEST_LEGACY_ENTITIES = [
  {
    fullName: 'Entity 1 Full Name',
    logoUrl: 'https://example.com/entity-1-logo.svg',
    name: '$$ Entity 1 Name',
  },
]

export const TEST_LEGACY_JOBS = [
  {
    state: JobState.DRAFT,
    title: '$$ Job 1 Title',
  },
]

export const TEST_LEGACY_SERVICES = [
  {
    $entity: TEST_LEGACY_ENTITIES[0].name,
    fullName: 'Service 1 Full Name',
    name: '$$ Service 1 Name',
    region: REGION['Auvergne-Rhône-Alpes'],
    websiteUrl: 'https://service-1.example.com',
  },
]

export const TEST_USERS = [
  {
    email: 'doris.fish@sea.com',
    firstName: 'Doris',
    lastName: 'Fish',
    password: 'nemo',
  },
]
