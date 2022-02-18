import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { structuredData } from '../libs/structuredData'

import type { JobWithRelation } from '../organisms/JobCard'

dayjs.extend(utc)

const normalizeDate = (date: Date | string) => dayjs.utc(date).format('YYYY-MM-DD')

/**
 * @see https://developers.google.com/search/docs/advanced/structured-data/job-posting
 */
export function generateJobStructuredData(job: JobWithRelation): string {
  const datePosted = normalizeDate(job.updatedAt)
  const employmentType = structuredData.normalizeEmploymentType(job.contractTypes)
  const hiringOrganization = structuredData.normalizeOrganization(job.recruiter)
  const jobLocation = structuredData.normalizePlace(job.address)
  const validThrough = normalizeDate(job.expiredAt)

  // —————————————————————————————————————————————————————————————————————————————
  // Required properties for Google Job Posting
  // https://developers.google.com/search/docs/advanced/structured-data/job-posting#job-posting-definition

  const data: any = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'France',
    },
    datePosted,
    description: job.missionDescription,
    employmentType,
    hiringOrganization,
    jobLocation,
    title: job.title,
    validThrough,
  }

  // —————————————————————————————————————————————————————————————————————————————
  // Optional (but recommended!) properties for Google Job Posting

  const maybeBaseSalary = structuredData.normalizeMonetaryAmount(job.salaryMin, job.salaryMax)
  if (maybeBaseSalary !== undefined) {
    data.baseSalary = maybeBaseSalary
  }

  return JSON.stringify(data, null, 2)
}
