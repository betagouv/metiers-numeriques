import { Select } from '@app/atoms/Select'
import * as R from 'ramda'
import { useCallback, useMemo } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { Domain } from '@prisma/client'

type DomainFilterProps = {
  domains: Domain[]
  onChange: (domainIds: string[]) => void
}
export function DomainFilter({ domains, onChange }: DomainFilterProps) {
  const options = useMemo(() => {
    const foundOthersDomain = R.find<Domain>(R.propEq('name', 'Autres'))(domains)
    const sortedDomains = foundOthersDomain
      ? [...R.reject(R.propEq('name', 'Autres'))(domains), foundOthersDomain]
      : domains

    return sortedDomains.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
  }, [domains])

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
