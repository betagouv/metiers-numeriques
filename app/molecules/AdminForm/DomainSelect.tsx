import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

type DomainSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  placeholder?: string
}

export function DomainSelect({ helper, isDisabled = false, label, name, placeholder }: DomainSelectProps) {
  const { errors, isSubmitting, setFieldValue, submitCount, touched, values } = useFormikContext<any>()

  const [domains, setDomains] = useState<Common.App.SelectOption[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/domains')
      .then(res => res.json())
      .then(domains => {
        if (domains?.data?.length) {
          setDomains(domains.data.map(domain => ({ label: domain.name, value: domain.id })))
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const hasError = (touched[name] !== undefined || submitCount > 0) && Boolean(errors[name])
  const isControlledDisabled = isLoading || isDisabled || isSubmitting
  const maybeError = hasError ? String(errors[name]) : undefined

  const defaultValue = useMemo(() => {
    const currentValue: string | null | undefined = values[name]

    if (currentValue === undefined || currentValue === null) {
      return undefined
    }

    return domains.find(domain => domain.value === currentValue)
  }, [values[name]])

  const updateFormikValues = (option: Common.App.SelectOption | null) => {
    if (option === null) {
      setFieldValue(name, null)

      return
    }

    const { value } = option

    setFieldValue(name, value)
  }

  return (
    <Select
      key={generateKeyFromValues(values[name])}
      defaultValue={defaultValue}
      error={maybeError}
      helper={helper}
      isClearable
      isDisabled={isControlledDisabled}
      isMulti
      label={label}
      name={name}
      onChange={updateFormikValues as any}
      options={domains}
      placeholder={placeholder}
    />
  )
}
