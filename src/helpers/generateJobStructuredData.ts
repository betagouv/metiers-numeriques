import structuredData from '../libs/structuredData'
import Job from '../models/Job'

const getDescription = (job: Job): string | undefined => job.mission

const getOrganizationData = (
  job: Job,
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
  if (job.service === undefined) {
    return undefined
  }

  if (job.service.entity !== undefined) {
    return {
      department: {
        name: job.service.shortName || job.service.name,
        websiteUrl: job.service.url,
      },
      logoUrl: job.service.entity.logoUrl,
      name: job.service.entity.name,
      websiteUrl: job.service.url,
    }
  }

  return {
    name: job.service.name,
    websiteUrl: job.service.url,
  }
}

/**
 * @see https://developers.google.com/search/docs/advanced/structured-data/job-posting
 */
export default function generateJobStructuredData(job: Job): string {
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
