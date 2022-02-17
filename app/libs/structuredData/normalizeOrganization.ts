/* eslint-disable @typescript-eslint/no-use-before-define */

import type { Recruiter } from '@prisma/client'

/**
 * @see https://schema.org/Organization
 */
type StructuredOrganization = {
  '@type': 'Organization'
  department?: {
    '@type': 'Organization'
    logo?: string
    name: string
    sameAs?: string
  }
  /** Logo URL */
  logo?: string
  name: string
  /** Website URL */
  sameAs?: string
}

export default function normalizeOrganization({ name, websiteUrl }: Recruiter): StructuredOrganization {
  const structuredOrganization: StructuredOrganization = {
    '@type': 'Organization',
    name,
  }

  if (websiteUrl !== null && websiteUrl.length !== 0) {
    structuredOrganization.sameAs = websiteUrl
  }

  return structuredOrganization
}
