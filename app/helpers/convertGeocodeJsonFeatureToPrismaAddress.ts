import handleError from '@common/helpers/handleError'

import getRegionNameFromZipCode from './getRegionNameFromZipCode'

import type { Prisma } from '@prisma/client'

export function convertGeocodeJsonFeatureToPrismaAddress({
  properties,
}: Common.GeocodeJsonFeature): Prisma.AddressCreateInput | undefined {
  try {
    const region = getRegionNameFromZipCode(properties.postcode)
    if (region === undefined) {
      return
    }

    const { city } = properties
    const postalCode = properties.postcode
    const street = properties.name

    return {
      city,
      postalCode,
      region,
      street,
    }
  } catch (err) {
    handleError(err, 'app/helpers/convertGeocodeJsonFeatureToPrismaAddress()')
  }
}
