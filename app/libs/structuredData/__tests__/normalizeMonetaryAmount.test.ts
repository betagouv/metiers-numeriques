import structuredData from '..'

describe('libs/structuredData.normalizeMonetaryAmount()', () => {
  test(`with 45000 and 63000`, () => {
    const salaryMin = 45000
    const salaryMax = 63000

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

  test(`with 63000 and 45000`, () => {
    const salaryMin = 63000
    const salaryMax = 45000

    const result = structuredData.normalizeMonetaryAmount(salaryMin, salaryMax)

    expect(result).toBeUndefined()
  })
})
