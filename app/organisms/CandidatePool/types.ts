import { Candidate, Domain, File, JobApplication, Profession, User } from '@prisma/client'

export type CandidateWithRelation = Candidate & { domains: Domain[]; professions: Profession[]; user: User }

export type JobApplicationWithRelation = JobApplication & {
  candidate: CandidateWithRelation
  cvFile: File
}
