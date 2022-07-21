import { generateKeyFromValues } from '@app/helpers/generateKeyFromValues'
import { Select } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useEffect, useMemo, useState } from 'react'

type DomainSelectProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  onChange?: (domainIds?: string[]) => void
  placeholder?: string
}

export function DomainSelect({ helper, isDisabled = false, label, name, onChange, placeholder }: DomainSelectProps) {
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
    if (values[name] === undefined || values[name] === null) {
      return values[name]
    }

    return values[name]
      .map(value => domains.find(option => option.value === value))
      .filter(value => value !== undefined) as Common.App.SelectOption[]
  }, [values[name], domains])

  const updateFormikValues = (options: Common.App.SelectOption[] | null) => {
    const values = options?.map(({ value }) => value)

    setFieldValue(name, values)

    if (onChange) {
      onChange(values)
    }
  }

  return (
    <Select
      key={generateKeyFromValues(domains, defaultValue)}
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
