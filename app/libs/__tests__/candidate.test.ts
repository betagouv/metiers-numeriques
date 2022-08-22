import {
  CandidateWithRelation,
  formatCandidateApplicationFile,
  formatSeniority,
  getCandidateFullName,
  JobApplicationWithRelation,
} from '@app/libs/candidate'
import { FileType, JobApplicationStatus, UserRole } from '@prisma/client'

const CANDIDATE: CandidateWithRelation = {
  contractTypes: [],
  createdAt: new Date(),
  currentJob: 'string',
  domains: [
    { createdAt: new Date(), id: 'army', name: 'Armée', updatedAt: new Date() },
    { createdAt: new Date(), id: 'ecolo', name: 'Ecologie', updatedAt: new Date() },
  ],
  githubUrl: 'string',
  id: 'candidate1',
  linkedInUrl: 'string',
  phone: '06060606',
  portfolioUrl: 'string',
  professions: [{ createdAt: new Date(), id: 'dev', name: 'Développement', updatedAt: new Date() }],
  region: 'string',
  seniorityInYears: 10,
  updatedAt: new Date(),
  user: {
    createdAt: new Date(),
    email: 'zizou@fff.fr',
    emailVerified: new Date(),
    extra: {},
    firstName: 'Zinedine',
    id: 'user1',
    institutionId: null,
    isActive: true,
    lastName: 'Zidane',
    password: 'password',
    recruiterId: null,
    role: UserRole.CANDIDATE,
    updatedAt: new Date(),
  },
  userId: 'user1',
}

const APPLICATION: JobApplicationWithRelation = {
  applicationLetter: 'Hello, my name is Zizou!',
  candidate: CANDIDATE,
  candidateId: CANDIDATE.id,
  createdAt: new Date(),
  cvFile: {
    createdAt: new Date(),
    id: 'cv1',
    title: 'Zizou_CV.pdf',
    type: FileType.EXTERNAL,
    updatedAt: new Date(),
    url: 'https://zizou.s3.aws.com',
  },
  cvFileId: 'cv1',
  id: 'cv1',
  jobId: null,
  rejectionReasons: [],
  status: JobApplicationStatus.PENDING,
  updatedAt: new Date(),
}

describe('app/libs/candidate', () => {
  describe('getCandidateFullName()', () => {
    test(`should return the candidate full name`, () => {
      expect(getCandidateFullName(CANDIDATE)).toEqual('Zinedine Zidane')
    })
  })

  describe('formatSeniority()', () => {
    test(`with seniorityInYears == 0`, () => {
      expect(formatSeniority(0)).toEqual('Profil Junior')
    })

    test(`with seniorityInYears == 1`, () => {
      expect(formatSeniority(1)).toEqual("1 an d'expérience")
    })

    test(`with seniorityInYears > 1`, () => {
      expect(formatSeniority(7)).toEqual("7 ans d'expérience")
    })
  })

  describe('formatCandidateApplicationFile()', () => {
    test(`should return a formatted text with basic candidate info`, () => {
      expect(formatCandidateApplicationFile(APPLICATION)).toEqual(
        'Nom: Zinedine Zidane\n' +
          'Email: zizou@fff.fr\n' +
          'Tel: 06060606\n' +
          'Localisation: string\n' +
          'Compétences: Développement\n' +
          "Domaines d'intérêt: Armée, Ecologie\n" +
          '\n' +
          'Hello, my name is Zizou!',
      )
    })
  })
})
