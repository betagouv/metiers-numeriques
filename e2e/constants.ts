import { JobState } from '@prisma/client'

export const TEST_CONTACTS = [
  {
    email: 'contact.1@example.com',
    name: '$$ Contact 1 Name',
    notes: 'Contact 1 Notes.',
    phone: '0123456789',
    position: 'Contact 1 Position',
  },
]

export const TEST_LEGACY_JOBS = [
  {
    state: JobState.DRAFT,
    title: '$$ Job 1 Title',
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
