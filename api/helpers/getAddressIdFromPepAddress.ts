import { convertGeocodeJsonFeatureToPrismaAddress } from '@common/helpers/convertGeocodeJsonFeatureToPrismaAddress'
import { handleError } from '@common/helpers/handleError'
import ky from 'ky-universal'

import type { PrismaClient } from '@prisma/client'

export async function getAddressIdFromPepAddress(
  prisma: PrismaClient,
  pepAddress: string,
): Promise<string | undefined> {
  try {
    const searchParams = {
      q: pepAddress,
    }
    const url = `https://api-adresse.data.gouv.fr/search/`
    const res: Common.GeocodeJson = await ky
      .get(url, {
        searchParams,
      })
      .json()
    if (!Array.isArray(res.features)) {
      throw new Error(`Expected features to be an array, got ${res.features} instead.`)
    }
    if (res.features.length === 0) {
      throw new Error(`PEP Address "${pepAddress}" not found.`)
    }

    const prismaAddress = convertGeocodeJsonFeatureToPrismaAddress(res.features[0])

    const existingAddress = await prisma.address.findFirst({
      where: {
        sourceId: prismaAddress.sourceId,
      },
    })
    if (existingAddress !== null) {
      return existingAddress.id
    }

    const newAddress = await prisma.address.create({
      data: prismaAddress,
    })

    return newAddress.id
  } catch (err) {
    handleError(err, 'app/helpers/getAddressIdFromPepAddress()')
  }
}
