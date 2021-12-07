/* eslint-disable @typescript-eslint/no-use-before-define */

/**
 * @see https://schema.org/MonetaryAmount
 */
type StructuredDataMonetaryAmount = {
  '@type': 'MonetaryAmount'
  currency: 'EUR'
  value:
    | {
        '@type': 'QuantitativeValue'
        unitText: 'DAY' | 'HOUR' | 'MONTH' | 'WEEK' | 'YEAR'
        value: number
      }
    | {
        '@type': 'QuantitativeValue'
        maxValue: number
        minValue: number
        unitText: 'DAY' | 'HOUR' | 'MONTH' | 'WEEK' | 'YEAR'
      }
}

const REGEXP = {
  DEFAULT: /(\d{2,3}).*(\d{2,3})/i,
}

export default function normalizeMonetaryAmount(salaryString: string): StructuredDataMonetaryAmount | undefined {
  const defaultResult = matchDefault(salaryString)

  if (defaultResult !== undefined) {
    return defaultResult
  }

  return undefined
}

const matchDefault = (addressString: string): StructuredDataMonetaryAmount | undefined => {
  const result = addressString.match(REGEXP.DEFAULT)
  if (result === null) {
    return undefined
  }

  const minValue = Number(result[1].trim()) * 1000
  const maxValue = Number(result[2].trim()) * 1000

  return {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: {
      '@type': 'QuantitativeValue',
      maxValue,
      minValue,
      unitText: 'YEAR',
    },
  }
}
