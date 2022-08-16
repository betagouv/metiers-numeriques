import { Select as WebSelect, SelectProps as WebSelectProps } from '@app/atoms/Select'
import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

export type SelectProps = WebSelectProps<Common.App.SelectOption>

export function Select({ isDisabled, name, options, ...props }: SelectProps) {
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
        .filter(value => value !== undefined)
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
    <WebSelect
      {...props}
      key={generateKeyFromValues(initialValues)}
      // @ts-ignore TODO: Fix it
      defaultValue={defaultValue}
      error={maybeError}
      isClearable
      isDisabled={isDisabled || isSubmitting}
      name={name}
      onChange={updateFormikValues as any}
      options={options}
    />
  )
}
