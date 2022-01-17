/* eslint-disable @typescript-eslint/no-use-before-define */

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

export default function normalizeOrganization({
  department,
  logoUrl,
  name,
  websiteUrl,
}: {
  department?: {
    logoUrl?: string
    name: string
    websiteUrl?: string
  }
  logoUrl?: string
  name: string
  websiteUrl?: string
}): StructuredOrganization {
  const structuredOrganization: StructuredOrganization = {
    '@type': 'Organization',
    name,
  }

  if (websiteUrl !== undefined) {
    structuredOrganization.sameAs = websiteUrl
  }

  if (logoUrl !== undefined) {
    structuredOrganization.logo = logoUrl
  }

  if (department !== undefined) {
    structuredOrganization.department = {
      '@type': 'Organization',
      name: department.name,
    }

    if (department.websiteUrl !== undefined) {
      structuredOrganization.department.sameAs = websiteUrl
    }

    if (department.logoUrl !== undefined) {
      structuredOrganization.department.logo = logoUrl
    }
  }

  return structuredOrganization
}
