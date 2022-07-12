import { JOB_CONTRACT_TYPE_LABEL, JOB_REMOTE_STATUS_LABEL } from '../common/constants.shared.js'

export const TEST_CONTACTS = [
  {
    email: 'contact.1@example.com',
    name: '$$ Contact 1 Name',
    note: 'Contact 1 Note',
    phone: '0000000001',
    position: 'Contact 1 Position',
  },
  {
    email: 'contact.2@example.com',
    name: '$$ Contact 2 Name',
    note: 'Contact 2 Note',
    phone: '0000000002',
    position: 'Contact 2 Position',
  },
  {
    email: 'contact.3@example.com',
    name: '$$ Contact 3 Name',
    note: 'Contact 3 Note',
    phone: '0000000003',
    position: 'Contact 3 Position',
  },
  {
    email: 'contact.4@example.com',
    name: '$$ Contact 4 Name',
    note: 'Contact 4 Note',
    phone: '0000000004',
    position: 'Contact 4 Position',
  },
]

export const TEST_INSTITUTIONS = [
  {
    description: 'Description A',
    name: '$$ Institution A Name',
    pageTitle: 'Institution A',
    url: 'iA.gouv.fr',
  },
  {
    description: 'Description B',
    name: '$$ Institution B Name',
    pageTitle: 'Institution B',
    url: 'iB.gouv.fr',
  },
]

export const TEST_TESTIMONIES = [
  {
    institution: TEST_INSTITUTIONS[0],
    job: 'Software Engineer',
    name: '$$ Testimony A',
    testimony: 'I really like this!',
  },
]

export const TEST_PROFESSIONS = [
  {
    name: '$$ Profession 1 Name',
  },
  {
    name: '$$ Profession 2 Name',
  },
]

export const TEST_RECRUITERS = [
  {
    displayName: '$$ Recruiter A1 Name',
    institution: {
      name: TEST_INSTITUTIONS[0].name,
    },
    websiteUrl: 'https://example.com/recruiter-a1',
  },
  {
    displayName: '$$ Recruiter A2 Name',
    institution: {
      name: TEST_INSTITUTIONS[0].name,
    },
    websiteUrl: 'https://example.com/recruiter-a2',
  },
  {
    displayName: '$$ Recruiter B1 Name',
    institution: {
      name: TEST_INSTITUTIONS[1].name,
    },
    websiteUrl: 'https://example.com/recruiter-b1',
  },
  {
    displayName: '$$ Recruiter B2 Name',
    institution: {
      name: TEST_INSTITUTIONS[1].name,
    },
    websiteUrl: 'https://example.com/recruiter-b2',
  },
]

export const TEST_JOB_DRAFTS = [
  {
    missionDescription: 'Job A1b Mission',
    recruiter: TEST_RECRUITERS[0],
    title: '$$ Job A1b Title',
  },
  {
    missionDescription: 'Job A2b Mission',
    recruiter: TEST_RECRUITERS[1],
    title: '$$ Job A2b Title',
  },
  {
    missionDescription: 'Job B1b Mission',
    recruiter: TEST_RECRUITERS[2],
    title: '$$ Job B1b Title',
  },
  {
    missionDescription: 'Job B2b Mission',
    recruiter: TEST_RECRUITERS[3],
    title: '$$ Job B2b Title',
  },
]

export const TEST_JOBS = [
  {
    address: {
      input: '20 avenue de Ségur',
      label: '20 Avenue de Ségur 75007 Paris, France',
    },
    applicationContacts: [TEST_CONTACTS[0], TEST_CONTACTS[1]],
    contractTypes: [JOB_CONTRACT_TYPE_LABEL.CONTRACT_WORKER_ONLY, JOB_CONTRACT_TYPE_LABEL.FREELANCER],
    infoContact: TEST_CONTACTS[2],
    missionDescription: 'Job A1a Mission',
    profession: TEST_PROFESSIONS[0],
    recruiter: TEST_RECRUITERS[0],
    remoteStatus: JOB_REMOTE_STATUS_LABEL.NONE,
    seniorityInYears: '0',
    title: '$$ Job A1a Title',
  },
  {
    address: {
      input: '20 avenue de Ségur',
      label: '20 Avenue de Ségur 75007 Paris, France',
    },
    applicationContacts: [TEST_CONTACTS[0], TEST_CONTACTS[1]],
    contractTypes: [JOB_CONTRACT_TYPE_LABEL.INTERN, JOB_CONTRACT_TYPE_LABEL.INTERNATIONAL_VOLUNTEER],
    infoContact: TEST_CONTACTS[3],
    missionDescription: 'Job A2a Mission',
    profession: TEST_PROFESSIONS[1],
    recruiter: TEST_RECRUITERS[1],
    remoteStatus: JOB_REMOTE_STATUS_LABEL.PARTIAL,
    seniorityInYears: '2',
    title: '$$ Job A2a Title',
  },
  {
    address: {
      input: '20 avenue de Ségur',
      label: '20 Avenue de Ségur 75007 Paris, France',
    },
    applicationContacts: [TEST_CONTACTS[0], TEST_CONTACTS[1]],
    contractTypes: [
      JOB_CONTRACT_TYPE_LABEL.NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER,
      JOB_CONTRACT_TYPE_LABEL.PART_TIME,
    ],
    infoContact: TEST_CONTACTS[2],
    missionDescription: 'Job B1a Mission',
    profession: TEST_PROFESSIONS[0],
    recruiter: TEST_RECRUITERS[2],
    remoteStatus: JOB_REMOTE_STATUS_LABEL.FULL,
    seniorityInYears: '0',
    title: '$$ Job B1a Title',
  },
  {
    address: {
      input: '20 avenue de Ségur',
      label: '20 Avenue de Ségur 75007 Paris, France',
    },
    applicationContacts: [TEST_CONTACTS[0], TEST_CONTACTS[1]],
    contractTypes: [JOB_CONTRACT_TYPE_LABEL.NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER],
    infoContact: TEST_CONTACTS[3],
    missionDescription: 'Job B2a Mission',
    profession: TEST_PROFESSIONS[1],
    recruiter: TEST_RECRUITERS[3],
    remoteStatus: JOB_REMOTE_STATUS_LABEL.NONE,
    seniorityInYears: '2',
    title: '$$ Job B2a Title',
  },
]

export const TEST_USERS = [
  {
    email: 'doris.fish@sea.com',
    firstName: 'Doris',
    lastName: 'Fish',
    password: 'doris',
    requestedInstitution: 'An institution',
    requestedService: 'A service',
  },
  {
    email: 'nemo.fish@sea.com',
    firstName: 'Nemo',
    lastName: 'Fish',
    password: 'nemo',
    recruiter: TEST_RECRUITERS[0],
    requestedInstitution: 'Another institution',
    requestedService: 'Another service',
  },
]

export const TEST_USER_ROLE = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  RECRUITER: 'RECRUITER',
}
