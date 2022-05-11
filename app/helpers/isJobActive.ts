import { JobState } from '@prisma/client'
import dayjs from 'dayjs'

import type { Job } from '@prisma/client'

export function isJobActive(job: Job): boolean {
  return job.state === JobState.PUBLISHED && !dayjs(job.expiredAt).isBefore(dayjs(), 'day')
}
