import { TextInput as SuiTextInput } from '@singularity/core'
import { useFormikContext } from 'formik'
import { ChangeEvent, ChangeEventHandler, useMemo } from 'react'

import type { TextInputProps } from '@singularity/core'

type CustomTextInputProps = Omit<TextInputProps, 'onBlur'> & {
  isDisabled?: boolean
  name: string
  onBlur?: (values) => Promise<void>
  onChange?: ChangeEventHandler<HTMLInputElement>
  type?: string
}
export function TextInput({
  autoComplete = 'off',
  isDisabled = false,
  name,
  onBlur,
  onChange,
  type = 'text',
  ...props
}: CustomTextInputProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const defaultVaLue = useMemo(() => values[name], [values[name]])

  const checkChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange !== undefined) {
      onChange(event)
    }

    handleChange(event)
  }

  return (
    <SuiTextInput
      autoComplete={autoComplete}
      defaultValue={defaultVaLue}
      disabled={isDisabled || isSubmitting}
      error={maybeError}
      name={name}
      onBlur={() => onBlur?.(values)}
      onChange={checkChange}
      type={type}
      {...props}
    />
  )
}
