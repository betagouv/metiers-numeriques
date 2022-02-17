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

export default function normalizeMonetaryAmount(
  salaryMin: number | null,
  salaryMax: number | null,
): StructuredDataMonetaryAmount | undefined {
  if (salaryMin === null || salaryMax === null || salaryMin > salaryMax) {
    return undefined
  }

  return {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: {
      '@type': 'QuantitativeValue',
      maxValue: salaryMax * 1000,
      minValue: salaryMin * 1000,
      unitText: 'YEAR',
    },
  }
}
