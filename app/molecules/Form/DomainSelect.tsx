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

  // TODO: there's a fetch problem. When the component renders with a pre-filled value, it's not shown on the component as options are not yet available
  //  Render the component when options are ready and it'll work better
  if (isLoading) {
    return null
  }

  return <Select {...props} isDisabled={isDisabled || isLoading} name={name} options={domains} />
}
