import { Textarea as SuiTextarea } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

type TextareaProps = {
  helper?: string
  isAutoResizing?: boolean
  isDisabled?: boolean
  label?: string
  name: string
  placeholder?: string
}
export function Textarea({
  helper,
  isAutoResizing = true,
  isDisabled = false,
  label,
  name,
  placeholder,
}: TextareaProps) {
  const { errors, handleChange, isSubmitting, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const defaultVaLue = useMemo(() => values[name], [values[name]])

  return (
    <SuiTextarea
      autoComplete="off"
      defaultValue={defaultVaLue}
      disabled={isDisabled || isSubmitting}
      error={maybeError}
      helper={helper}
      isAutoResizing={isAutoResizing}
      label={label}
      name={name}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}
