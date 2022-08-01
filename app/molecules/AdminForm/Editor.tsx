import { MarkdownEditor } from '@singularity/core'
import cuid from 'cuid'
import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useCallback, useMemo } from 'react'

type EditorProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  onBlur?: (values) => void
  placeholder: string
}
export function Editor({ helper, isDisabled = false, label, name, onBlur, placeholder }: EditorProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const parentKey = useMemo(() => cuid(), [])
  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const defaultValue = values[name]

  const updateFormikValues = useCallback(
    debounce((markdownSource: string) => {
      setFieldValue(name, markdownSource)
    }, 500),
    [],
  )

  return (
    <MarkdownEditor
      key={String(defaultValue)}
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isDisabled={isDisabled || isSubmitting}
      label={label}
      name={name}
      onBlur={() => onBlur?.(values)}
      onChange={updateFormikValues}
      parentKey={String(defaultValue)}
      placeholder={placeholder}
    />
  )
}
