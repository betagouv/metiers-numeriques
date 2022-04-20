import { useLazyQuery } from '@apollo/client'
import { convertGeocodeJsonFeatureToPrismaAddress } from '@common/helpers/convertGeocodeJsonFeatureToPrismaAddress'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import ky from 'ky-universal'
import * as R from 'ramda'

import { generateKeyFromValues } from '../../helpers/generateKeyFromValues'
import { getCountryFromCode } from '../../helpers/getCountryFromCode'
import queries from '../../queries'

import type { Address, Prisma } from '@prisma/client'

const PER_PAGE = 5

type AddressSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
}
export function AddressSelect({ helper, isDisabled = false, label, name }: AddressSelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const [getAddresses] = useLazyQuery(queries.address.GET_ALL, {
    fetchPolicy: 'no-cache',
  })

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const placeholder = 'Ex.: 20 avenue de Ségur'
  const rawValue: any = values[name] ?? null
  const defaultValue: Common.App.SelectOption<Prisma.AddressCreateInput> | null =
    rawValue !== null
      ? {
          label: `${rawValue.street}, ${rawValue.postalCode} ${rawValue.city}, ${getCountryFromCode(rawValue.country)}`,
          value: rawValue,
        }
      : rawValue

  const queryAddress = async (query: string): Promise<Common.App.SelectOption<Prisma.AddressCreateInput>[]> => {
    const searchParams = {
      q: query,
    }
    const url = `https://api-adresse.data.gouv.fr/search/`
    const res: Common.GeocodeJson = await ky
      .get(url, {
        searchParams,
      })
      .json()

    if (!Array.isArray(res.features)) {
      return []
    }

    if (res.features.length === 0) {
      const getAddressesResult = await getAddresses({
        variables: {
          pageIndex: 0,
          perPage: PER_PAGE,
          query,
        },
      })

      return getAddressesResult.data.getAddresses.data.map((prismaAddress: Common.Graphqled<Address>) => {
        const { city, country, postalCode, region, street } = prismaAddress
        const value = R.omit(['__typename'])(prismaAddress)

        return {
          label: `${street}, ${postalCode} ${city}, ${region}, ${getCountryFromCode(country)}`,
          value,
        }
      })
    }

    const resultsAsOptions = res.features.reduce(
      (options: Common.App.SelectOption<Prisma.AddressCreateInput>[], feature) => {
        const prismaAddress = convertGeocodeJsonFeatureToPrismaAddress(feature)
        if (prismaAddress === undefined) {
          return options
        }

        return [
          ...options,
          {
            label: `${feature.properties.label}, France`,
            value: prismaAddress,
          },
        ]
      },
      [],
    )

    return resultsAsOptions
  }

  const updateFormikValues = (option: Common.App.SelectOption<Prisma.AddressCreateInput> | null) => {
    if (option === null) {
      setFieldValue(name, undefined)

      return
    }

    const { value } = option

    setFieldValue(name, value)
  }

  return (
    <Select
      key={generateKeyFromValues(defaultValue)}
      defaultValue={defaultValue as any}
      error={maybeError}
      helper={helper}
      isAsync
      isClearable
      isDisabled={isDisabled || isSubmitting}
      label={label}
      loadOptions={queryAddress as any}
      name={name}
      onChange={updateFormikValues as any}
      placeholder={placeholder}
    />
  )
}
