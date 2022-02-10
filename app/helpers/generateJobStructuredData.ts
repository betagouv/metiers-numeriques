import structuredData from '../libs/structuredData'
import { convertHumanDateToIso8601 } from './convertHumanDateToIso8601'

import type { JobWithRelation } from '../organisms/JobCard'

/**
 * @see https://developers.google.com/search/docs/advanced/structured-data/job-posting
 */
export default function generateJobStructuredData(job: JobWithRelation): string {
  const datePosted = convertHumanDateToIso8601(job.updatedAt as unknown as string)
  const hiringOrganization = structuredData.normalizeOrganization(job.recruiter)
  const jobLocation = structuredData.normalizePlace(job.address)
  const validThrough = convertHumanDateToIso8601(job.expiredAt as unknown as string)

  // —————————————————————————————————————————————————————————————————————————————
  // Required properties for Google Job Posting
  // https://developers.google.com/search/docs/advanced/structured-data/job-posting#job-posting-definition

  const structureData: any = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'France',
    },
    datePosted,
    description: job.missionDescription,
    hiringOrganization,
    jobLocation,
    title: job.title,
    validThrough,
  }

  // —————————————————————————————————————————————————————————————————————————————
  // Optional (but recommended!) properties for Google Job Posting

  const maybeBaseSalary = structuredData.normalizeMonetaryAmount(job.salaryMin, job.salaryMax)
  if (maybeBaseSalary !== undefined) {
    structureData.baseSalary = maybeBaseSalary
  }

  return JSON.stringify(structureData, null, 2)
}
