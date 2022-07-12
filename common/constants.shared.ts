/* eslint-disable sort-keys-fix/sort-keys-fix */
/**
 * These constant are splitted in this importless file because they are also used by Playwright E2E tests.
 * Indeed Playwright is stuck with Typescript parser and makes our life a hell regarding ESM support.
 */

import { JobContractType, JobRemoteStatus } from '@prisma/client'

export const SELECTABLE_JOB_CONTRACT_TYPES = [
  JobContractType.NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER,
  JobContractType.CONTRACT_WORKER_ONLY,
  JobContractType.FREELANCER,
  JobContractType.APPRENTICESHIP,
  JobContractType.INTERN,
  JobContractType.INTERNATIONAL_VOLUNTEER,
]

export const JOB_CONTRACT_TYPE_LABEL: Record<JobContractType, string> = {
  NATIONAL_CIVIL_SERVANT_OR_CONTRACT_WORKER: 'Contractuels ou fonctionnaires',
  CONTRACT_WORKER_ONLY: 'Ouvert uniquement aux contractuels',
  FREELANCER: 'Freelance',
  APPRENTICESHIP: 'Apprentissage',
  INTERN: 'Stage',
  INTERNATIONAL_VOLUNTEER: 'VIA (VIE)',
  // LEGACY
  CONTRACT_WORKER: 'Contractuel',
  NATIONAL_CIVIL_SERVANT: 'Fonctionnaire',
  PART_TIME: 'Temps partiel',
  PERMANENT: 'CDI',
  TEMPORARY: 'CDD',
}

export const JOB_REMOTE_STATUS_LABEL: Record<JobRemoteStatus, string> = {
  FULL: 'Total',
  PARTIAL: 'Partiel',
  NONE: 'Non',
}
