import countriesAsOptions from '@common/data/countriesAsOptions.json'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { generateKeyFromValues } from '../../helpers/generateKeyFromValues'

type CountrySelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  placeholder?: string
}

export function CountrySelect({ helper, isDisabled = false, label, name, placeholder }: CountrySelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = isDisabled || isSubmitting
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
      key={generateKeyFromValues(values[name])}
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
