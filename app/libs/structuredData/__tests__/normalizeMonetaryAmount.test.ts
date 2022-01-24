import structuredData from '..'

describe('libs/structuredData.normalizeMonetaryAmount()', () => {
  test(`with "Entre 45k€ et 63 K€ annuels bruts"`, () => {
    const salaryString = `Entre 45k€ et 63 K€ annuels bruts`

    const result = structuredData.normalizeMonetaryAmount(salaryString)

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

  test(`with "La rémunération est à définir en fonction de l’expérience et du profil"`, () => {
    const salaryString = `La rémunération est à définir en fonction de l’expérience et du profil`

    const result = structuredData.normalizeMonetaryAmount(salaryString)

    expect(result).toBeUndefined()
  })
})
