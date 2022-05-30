/**
 * These constant are splitted in this importless file because they are also used by Playwright E2E tests.
 * Indeed Playwright is stuck with Typescript parser and makes our life a hell regarding ESM support.
 */

import type { JobContractType, JobRemoteStatus } from '@prisma/client'

export const JOB_CONTRACT_TYPE_LABEL: Record<JobContractType, string> = {
  CONTRACT_WORKER: 'Contractuel',
  FREELANCER: 'Freelance',
  INTERN: 'Stage',
  INTERNATIONAL_VOLUNTEER: 'VIA (VIE)',
  NATIONAL_CIVIL_SERVANT: 'Fonctionnaire',
  PART_TIME: 'Temps partiel',
  PERMANENT: 'CDI',
  TEMPORARY: 'CDD',
}

export const JOB_REMOTE_STATUS_LABEL: Record<JobRemoteStatus, string> = {
  FULL: 'Total',
  PARTIAL: 'Partiel',
  // eslint-disable-next-line sort-keys-fix/sort-keys-fix
  NONE: 'Non',
}
