import { TextInput as TextInputAtom } from '@app/atoms/TextInput'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import type { TextInputProps } from '@app/atoms/TextInput'

export function TextInput(props: TextInputProps) {
  const { disabled, name } = props
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const defaultValue = useMemo(() => values[name], [])
  const isControlledDisabled = useMemo(() => disabled || isSubmitting, [disabled, isSubmitting])

  const maybeError = useMemo(
    () =>
      (touched[name] !== undefined || submitCount > 0) && errors[name] !== undefined ? String(errors[name]) : undefined,
    [errors, touched],
  )

  return (
    <TextInputAtom
      defaultValue={defaultValue}
      disabled={isControlledDisabled}
      error={maybeError}
      onChange={handleChange}
      {...props}
    />
  )
}
