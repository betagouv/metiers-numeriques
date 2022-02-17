import { TextInput as SuiTextInput } from '@singularity/core'
import { useFormikContext } from 'formik'

import type { ChangeEvent, ChangeEventHandler } from 'react'

type TextInputProps = {
  autoComplete?: string
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  type?: string
}
export function TextInput({
  autoComplete = 'off',
  helper,
  isDisabled = false,
  label,
  name,
  onChange,
  placeholder,
  type = 'text',
}: TextInputProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const checkChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange !== undefined) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <SuiTextInput
      autoComplete={autoComplete}
      defaultValue={values[name]}
      disabled={isDisabled || isSubmitting}
      error={maybeError}
      helper={helper}
      label={label}
      name={name}
      onChange={checkChange}
      placeholder={placeholder}
      type={type}
    />
  )
}
