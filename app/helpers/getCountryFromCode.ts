import countriesAsOptions from '@common/data/countriesAsOptions.json'

export function getCountryFromCode(countryCode: string): string {
  const foundCountryAsOption = countriesAsOptions.find(countryAsOption => countryAsOption.value === countryCode)

  if (foundCountryAsOption === undefined) {
    return '[PAYS INCONNU]'
  }

  return foundCountryAsOption.label
}
