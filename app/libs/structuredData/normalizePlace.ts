/* eslint-disable @typescript-eslint/no-use-before-define */

import getRegionNameFromZipCode from '../../helpers/getRegionNameFromZipCode'

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

const REGEXP = {
  DEFAULT: /(\d+[a-z]*)[\s,]+([^,-]+)[\s,-]+([\d\s]+)[\s,-]+(.*)/i,
}

export default function normalizePlace(addressString: string): StructuredDataPlace | undefined {
  const defaultResult = matchDefault(addressString)

  if (defaultResult !== undefined) {
    return defaultResult
  }

  return undefined
}

const matchDefault = (addressString: string): StructuredDataPlace | undefined => {
  const result = addressString.match(REGEXP.DEFAULT)
  if (result === null) {
    return undefined
  }

  const streetAddress = `${result[1].trim()} ${result[2].trim()}`
  const postalCode = result[3].replace(/[^\d]+/g, '').trim()
  const addressLocality = result[4].trim()
  const addressRegion = getRegionNameFromZipCode(postalCode)

  return {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality,
      addressRegion,
      postalCode,
      streetAddress,
    },
  }
}
