/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * @see https://schema.org/Place
 */
type StructuredDataPlace = {
  '@type': 'Place'
  address: {
    '@type': 'PostalAddress'
    addressCountry: string
    addressLocality?: string
    postalCode?: string
    streetAddress?: string
  }
}

const REGEXP = {
  DEFAULT: /(\d+[a-z]*)[\s,]+([^,-]+)[\s,-]+([\d\s]+)[\s,-]+(.*)/i,
}

export default function normalizePlace(addressString: string): StructuredDataPlace {
  const defaultResult = matchDefault(addressString)

  if (defaultResult !== undefined) {
    return defaultResult
  }

  return {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
    },
  }
}

const matchDefault = (addressString: string): StructuredDataPlace | undefined => {
  const result = addressString.match(REGEXP.DEFAULT)
  if (result === null) {
    return undefined
  }

  const streetAddress = `${result[1].trim()} ${result[2].trim()}`
  const postalCode = result[3].replace(/[^\d]+/g, '').trim()
  const addressLocality = result[4].trim()

  return {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'FR',
      addressLocality,
      postalCode,
      streetAddress,
    },
  }
}
