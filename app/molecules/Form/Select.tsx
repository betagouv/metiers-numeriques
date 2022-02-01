import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { Select as SuiSelect } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

type SelectProps = {
  helper?: string
  isAsync?: boolean
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  options?: Common.App.SelectOption[]
  placeholder?: string
}
export function Select({
  helper,
  isAsync = false,
  isDisabled = false,
  isMulti = false,
  label,
  name,
  options = [],
  placeholder,
}: SelectProps) {
  const { errors, initialValues, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const defaultValue = useMemo(() => {
    const valueOrValues: string | string[] | null | undefined = values[name]

    if (valueOrValues === undefined || valueOrValues === null) {
      return valueOrValues
    }

    if (Array.isArray(valueOrValues)) {
      return valueOrValues
        .map(value => options.find(option => option.value === value))
        .filter(value => value !== undefined) as Common.App.SelectOption[]
    }

    return options.find(({ value }) => value === valueOrValues)
  }, [values[name]])

  const updateFormikValues = (optionOrOptions: Common.App.SelectOption | Common.App.SelectOption[] | null) => {
    if (Array.isArray(optionOrOptions)) {
      const values = optionOrOptions.map(({ value }) => value)

      setFieldValue(name, values)

      return
    }

    if (optionOrOptions === null) {
      setFieldValue(name, null)

      return
    }

    const { value } = optionOrOptions

    setFieldValue(name, value)
  }

  return (
    <SuiSelect
      key={generateKeyFromValue(initialValues)}
      cacheOptions={isAsync}
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isClearable
      isDisabled={isDisabled || isSubmitting}
      isMulti={isMulti}
      label={label}
      name={name}
      onChange={updateFormikValues}
      options={!isAsync ? options : undefined}
      placeholder={placeholder}
    />
  )
}
