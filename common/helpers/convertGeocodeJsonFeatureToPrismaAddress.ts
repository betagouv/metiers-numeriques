import { getRegionNameFromZipCode } from './getRegionNameFromZipCode'
import { handleError } from './handleError'

import type { Prisma } from '@prisma/client'

export function convertGeocodeJsonFeatureToPrismaAddress({
  properties,
}: Common.GeocodeJsonFeature): Prisma.AddressCreateInput {
  try {
    const region = getRegionNameFromZipCode(properties.postcode)
    if (region === undefined) {
      throw new Error(`Could not find region for zip code ${properties.postcode}.`)
    }

    const { city } = properties
    const postalCode = properties.postcode
    const country = 'FR'
    const sourceId = properties.id
    const street = properties.name

    return {
      city,
      country,
      postalCode,
      region,
      sourceId,
      street,
    }
  } catch (err) /* istanbul ignore next */ {
    return handleError(err, 'common/helpers/convertGeocodeJsonFeatureToPrismaAddress()') as never
  }
}
