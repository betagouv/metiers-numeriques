import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import ky from 'ky-universal'

import { convertGeocodeJsonFeatureToPrismaAddress } from '../../helpers/convertGeocodeJsonFeatureToPrismaAddress'
import generateKeyFromValue from '../../helpers/generateKeyFromValue'

import type { Prisma } from '@prisma/client'

type AddressSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
}
export function AddressSelect({ helper, isDisabled = false, label, name }: AddressSelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const placeholder = 'Ex.: 20 avenue de Ségur'
  const rawValue: any = values[name] ?? null
  const defaultValue: Common.App.SelectOption<Prisma.AddressCreateInput> | null =
    rawValue !== null
      ? {
          label: `${rawValue.street} ${rawValue.postalCode} ${rawValue.city}`,
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

    if (!Array.isArray(res.features) || res.features.length === 0) {
      return []
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
            label: feature.properties.label,
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
      key={generateKeyFromValue(defaultValue)}
      defaultValue={defaultValue as any}
      error={maybeError}
      helper={helper}
      isAsync
      isClearable
      isDisabled={isDisabled || isSubmitting}
      label={label}
      loadOptions={queryAddress}
      name={name}
      onChange={updateFormikValues as any}
      placeholder={placeholder}
    />
  )
}
