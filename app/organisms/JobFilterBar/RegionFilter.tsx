import { Select } from '@app/atoms/Select'
import { Region, REGIONS_AS_OPTIONS } from '@common/constants'
import { useCallback } from 'react'

import type { SelectOption } from '@app/atoms/Select'

type RegionFilterProps = {
  onChange: (region: Region | undefined) => void | Promise<void>
}
export function RegionFilter({ onChange }: RegionFilterProps) {
  const handleChange = useCallback((regionAsOption: SelectOption<Region>) => {
    onChange(regionAsOption ? regionAsOption.value : undefined)
  }, [])

  return (
    <Select
      isClearable
      label="Filtrer par région"
      name="profession"
      onChange={handleChange as any}
      options={REGIONS_AS_OPTIONS}
    />
  )
}
