import { MarkdownEditor } from '@singularity/core'
import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useCallback } from 'react'

type EditorProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  placeholder: string
}
export function Editor({ helper, isDisabled = false, label, name, placeholder }: EditorProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined
  const defaultValue = values[name] || '<br>' // TODO: handle undefined value

  const updateFormikValues = useCallback(
    debounce((markdownSource: string) => {
      setFieldValue(name, markdownSource)
    }, 500),
    [],
  )

  return (
    <MarkdownEditor
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isDisabled={isDisabled || isSubmitting}
      label={label}
      name={name}
      onChange={updateFormikValues}
      placeholder={placeholder}
    />
  )
}
