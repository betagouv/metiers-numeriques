import { Select } from '@app/atoms/Select'
import * as R from 'ramda'
import { useCallback } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { Domain } from '@prisma/client'

type DomainFilterProps = {
  domains: Pick<Domain, 'id' | 'name'>[]
  onChange: (domainIds: string[]) => void
}
export function DomainFilter({ domains, onChange }: DomainFilterProps) {
  const options = domains.map(({ id, name }) => ({
    label: name,
    value: id,
  }))

  const handleChange = useCallback((domainsAsOptions: SelectOption[]) => {
    onChange(domainsAsOptions.map(R.prop('value')))
  }, [])

  return (
    <Select
      isClearable
      isMulti
      label="Filtrer par domaine"
      name="domain"
      onChange={handleChange as any}
      options={options}
    />
  )
}
