import structuredData from '../libs/structuredData'

import type { LegacyJobWithRelation } from '../organisms/JobCard'

const getDescription = (job: LegacyJobWithRelation): string | null => job.mission

const getOrganizationData = (
  job: LegacyJobWithRelation,
):
  | {
      department?: {
        logoUrl?: string
        name: string
        websiteUrl?: string
      }
      logoUrl?: string
      name: string
      websiteUrl?: string
    }
  | undefined => {
  if (job.legacyService === null) {
    return undefined
  }

  if (job.legacyService.legacyEntity !== null) {
    return {
      department: {
        name: job.legacyService.shortName || job.legacyService.name || '',
        websiteUrl: job.legacyService.url || '',
      },
      logoUrl: job.legacyService.legacyEntity.logoUrl || '',
      name: job.legacyService.legacyEntity.name || '',
      websiteUrl: job.legacyService.url || '',
    }
  }

  return {
    name: job.legacyService.name || '',
    websiteUrl: job.legacyService.url || '',
  }
}

/**
 * @see https://developers.google.com/search/docs/advanced/structured-data/job-posting
 */
export default function generateJobStructuredData(job: LegacyJobWithRelation): string {
  const maybeDescription = getDescription(job)
  if (maybeDescription === undefined) {
    return JSON.stringify({})
  }

  const maybeJobLocation = structuredData.normalizePlace(String(job.locations[0]))
  if (maybeJobLocation === undefined) {
    return JSON.stringify({})
  }

  const maybeOrganizationData = getOrganizationData(job)
  if (maybeOrganizationData === undefined) {
    return JSON.stringify({})
  }

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
    datePosted: job.updatedAt,
    description: maybeDescription,
    hiringOrganization: structuredData.normalizeOrganization(maybeOrganizationData),
    jobLocation: maybeJobLocation,
    title: job.title,
  }

  // —————————————————————————————————————————————————————————————————————————————
  // Optional (but recommended!) properties for Google Job Posting

  const maybeBaseSalary = structuredData.normalizeMonetaryAmount(String(job.salary))
  if (maybeBaseSalary !== undefined) {
    structureData.baseSalary = maybeBaseSalary
  }

  return JSON.stringify(structureData, null, 2)
}
