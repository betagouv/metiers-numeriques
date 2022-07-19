import { Candidate, Domain, File, JobApplication, JobContractType, Profession, User } from '@prisma/client'

export type CandidateWithRelation = Candidate & { domains: Domain[]; professions: Profession[]; user: User }

export type JobApplicationWithRelation = JobApplication & {
  candidate: CandidateWithRelation
  cvFile: File
}

export type FilterProps = {
  contractTypes?: JobContractType[]
  domainIds?: string[]
  keyword?: string
  professionId?: string
  region?: string
  seniority?: number
}
