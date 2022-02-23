import { useQuery } from '@apollo/client'
import countriesAsOptions from '@common/data/countriesAsOptions.json'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import generateKeyFromValue from '../../helpers/generateKeyFromValue'
import queries from '../../queries'

type CountrySelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  placeholder?: string
}

export function CountrySelect({ helper, isDisabled = false, label, name, placeholder }: CountrySelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()
  const getCountrysListResult = useQuery(queries.contact.GET_LIST)

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = getCountrysListResult.loading || isDisabled || isSubmitting
  const maybeError = hasError ? String(errors[name]) : undefined

  const defaultValue = useMemo(() => {
    const currentValue: string | null | undefined = values[name]

    if (currentValue === undefined || currentValue === null) {
      return undefined
    }

    return countriesAsOptions.find(countryAsOption => countryAsOption.value === currentValue)
  }, [values[name]])

  const updateFormikValues = (option: Common.App.SelectOption | null) => {
    if (option === null) {
      setFieldValue(name, null)

      return
    }

    const { value } = option

    setFieldValue(name, value)
  }

  return (
    <Select
      key={generateKeyFromValue(values[name])}
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isClearable
      isDisabled={isControlledDisabled}
      label={label}
      name={name}
      onChange={updateFormikValues}
      options={countriesAsOptions}
      placeholder={placeholder}
    />
  )
}
