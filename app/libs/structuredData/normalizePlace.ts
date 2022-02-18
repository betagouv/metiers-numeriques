/* eslint-disable @typescript-eslint/no-use-before-define */

import type { Address } from '@prisma/client'

/**
 * @see https://schema.org/Place
 * @see https://schema.org/PostalAddress
 */
type StructuredDataPlace = {
  '@type': 'Place'
  address: {
    '@type': 'PostalAddress'
    /**
     * Two-letter country code following ISO 3166-1 alpha-2 standard
     *
     * @see https://en.wikipedia.org/wiki/ISO_3166-1
     * @see https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
     */
    addressCountry: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    streetAddress?: string
  }
}

export function normalizePlace(address: Address): StructuredDataPlace {
  return {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: address.country,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      streetAddress: address.street,
    },
  }
}
