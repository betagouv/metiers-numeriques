import { TextInput as TextInputAtom } from '@app/atoms/TextInput'
import { useField, useFormikContext } from 'formik'
import { useMemo } from 'react'

import type { TextInputProps } from '@app/atoms/TextInput'

export function TextInput(props: TextInputProps) {
  const { disabled, name } = props
  const { isSubmitting, submitCount } = useFormikContext<any>()
  const [field, meta, helper] = useField(name)

  const defaultValue = useMemo(() => field.value, [])
  const isControlledDisabled = useMemo(() => disabled || isSubmitting, [disabled, isSubmitting])

  const maybeError = useMemo(
    () =>
      (meta.touched !== undefined || submitCount > 0) && meta.error !== undefined ? String(meta.error) : undefined,
    [meta.error, meta.touched],
  )

  return (
    <TextInputAtom
      defaultValue={defaultValue}
      disabled={isControlledDisabled}
      error={maybeError}
      onChange={e => helper.setValue(e.target.value)}
      {...props}
    />
  )
}
