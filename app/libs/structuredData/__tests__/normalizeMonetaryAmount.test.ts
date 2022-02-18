import { structuredData } from '..'

describe('libs/structuredData.normalizeMonetaryAmount()', () => {
  test(`with 45 and 63`, () => {
    const salaryMin = 45
    const salaryMax = 63

    const result = structuredData.normalizeMonetaryAmount(salaryMin, salaryMax)

    expect(result).toStrictEqual({
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: {
        '@type': 'QuantitativeValue',
        maxValue: 63000,
        minValue: 45000,
        unitText: 'YEAR',
      },
    })
  })

  test(`with 63 and 45`, () => {
    const salaryMin = 63
    const salaryMax = 45

    const result = structuredData.normalizeMonetaryAmount(salaryMin, salaryMax)

    expect(result).toBeUndefined()
  })
})
