import { CandidateWithRelation } from '@app/organisms/CandidatePool/types'

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
