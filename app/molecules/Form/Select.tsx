import { Select as SingularitySelect } from '@singularity/core'
import { useFormikContext } from 'formik'

type SelectProps = {
  helper?: string
  isAsync?: boolean
  isDisabled?: boolean
  isMulti?: boolean
  label: string
  name: string
  noLabel?: boolean
  options?: any[]
}
export function Select({
  helper,
  isAsync = false,
  isDisabled = false,
  isMulti = false,
  label,
  name,
  noLabel = false,
  options,
}: SelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const maybeError = hasError ? String(errors[name]) : undefined

  const updateFormikValues = option => {
    setFieldValue(name, option)
  }

  return (
    <SingularitySelect
      cacheOptions={isAsync}
      defaultValue={values[name]}
      disabled={isDisabled || isSubmitting}
      error={maybeError}
      helper={helper}
      isAsync={isAsync}
      isMulti={isMulti}
      label={!noLabel ? label : null}
      loadOptions={isAsync ? options : null}
      name={name}
      onChange={updateFormikValues}
      // onInputChange={isAsync ? updateFormikValues2 : null}
      options={!isAsync ? options : undefined}
      placeholder={noLabel ? label : null}
    />
  )
}
