import { Candidate, Domain, File, JobApplication, Profession, User } from '@prisma/client'

export type CandidateWithRelation = Candidate & { domains: Domain[]; professions: Profession[]; user: User }

export type JobApplicationWithRelation = JobApplication & {
  candidate: CandidateWithRelation
  cvFile: File
}

export const getCandidateFullName = (candidate: CandidateWithRelation) =>
  `${candidate.user.firstName} ${candidate.user.lastName}`

export const formatSeniority = (seniority: number) => {
  if (seniority > 1) {
    return `${seniority} ans d'expérience`
  }
  if (seniority === 1) {
    return `${seniority} an d'expérience`
  }

  return 'Profil Junior'
}

export const formatCandidateApplicationFile = (application: JobApplicationWithRelation) =>
  [
    `Nom: ${getCandidateFullName(application.candidate)}`,
    `Email: ${application.candidate.user.email}`,
    `Tel: ${application.candidate.phone}`,
    `Localisation: ${application.candidate.region}`,
    `Compétences: ${application.candidate.professions.map(p => p.name).join(', ')}`,
    `Domaines d'intérêt: ${application.candidate.domains.map(d => d.name).join(', ')}`,
    '',
    application.applicationLetter,
  ].join('\n')
