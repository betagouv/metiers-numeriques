import { useEffect, useState } from 'react'

import { Select, SelectProps } from './Select'

type DomainSelectProps = Omit<SelectProps, 'options'>

export function DomainSelect({ isDisabled, name, ...props }: DomainSelectProps) {
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

  return (
    <Select
      {...props}
      // This key helps rerender the component once domains are fetched while keeping the form value displayed
      key={`domains_${isLoading ? 'loading' : 'ready'}`}
      isDisabled={isDisabled || isLoading}
      name={name}
      options={domains}
    />
  )
}
